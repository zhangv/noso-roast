<template>
	<v-card-title class="d-flex align-center">
		生豆管理
		<v-icon color="primary" dark @click="add">$plus</v-icon>
		<v-icon color="info" @click="load">$reload</v-icon>
		<v-spacer></v-spacer>
	</v-card-title>
	<BeanList ref="thelist" show-select :single-select="false">
		<template v-slot:batchActions="{ selected }"></template>
		<template v-slot:actions="{ item }">
			<v-icon class="mr-2 mb-1" @click="edit(item)">$edit</v-icon>
			<v-icon class="mr-2 mb-1" @click="del(item)" color="error">$delete</v-icon>
			<v-btn class="mr-2 mb-1" small @click="batch(item)">批次查询</v-btn>
			<v-btn class="mr-2 mb-1" small @click="inStock(item)">入库</v-btn>
			<v-btn class="mr-2 mb-1" small @click="price(item)">价格</v-btn>
			<v-btn class="mr-2 mb-1" small @click="outStock(item)">出库</v-btn>
			<v-btn class="mr-2 mb-1" small @click="tagging(item)">标签</v-btn>
		</template>
	</BeanList>
	<v-dialog v-model="taggingDlg">
		<v-card>
			<v-card-title>
				标签
				<v-chip v-for="tag in tags" :key="tag.id">{{ tag.name }}</v-chip>
			</v-card-title>
			<v-card-text>
				标签组：
				<v-card v-for="group in taggingGroups" :key="group.id">
					<v-card-title>
						{{ group.name }} -
						<template v-for="tag in group.tags" :key="tag.id">
							<tempalte v-if="tagNames.includes(tag.name)">
								<v-chip class="mr-0" variant="outlined">
									{{ tag.name }}
									<v-icon class="mr-1" size="small" color="error" @click="removeTag(tag.id)">
										$close
									</v-icon>
								</v-chip>
							</tempalte>
							<template v-else>
								<v-chip>
									{{ tag.name }}
									<v-icon @click="addTag({ name: tag.name, group_name: group.name })" color="primary">
										$plus
									</v-icon>
								</v-chip>
							</template>
						</template>
					</v-card-title>
				</v-card>
			</v-card-text>
			<v-card-text class="d-flex align-center">
				<v-text-field v-model="addTagForm.name" label="标签" style="width: 10rem" class="mr-2" />
				<v-text-field v-model="addTagForm.group_name" label="标签组" style="width: 10rem" class="mr-2" />
				<v-btn @click="addTag">添加标签</v-btn>
			</v-card-text>
			<v-card-actions>
				<v-btn color="primary" @click="taggingDlg = false">关闭</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
	<v-dialog v-model="formDlg">
		<v-card>
			<v-card-title>编辑生豆信息</v-card-title>
			<v-card-text>
				<bean-form v-model:value="form" :errors="errors">
					<template #actions="{ object }">
						<v-btn color="primary" large @click="save(object)">保存</v-btn>
						<v-btn color="" large @click="formDlg = false">关闭</v-btn>
					</template>
				</bean-form>
			</v-card-text>
		</v-card>
	</v-dialog>
	<v-dialog v-model="batchDlg">
		<bean-batch-form v-model:value="batchForm" :errors="batchErrors">
			<template #actions="{ object }">
				<v-btn color="primary" large @click="saveBatch(object)">保存</v-btn>
				<v-btn color="" large @click="batchDlg = false">关闭</v-btn>
			</template>
		</bean-batch-form>
	</v-dialog>
	<v-dialog v-model="outDlg" max-width="80%">
		<BeanStockLogForm v-model:value="outForm" :errors="outErrors">
			<template #actions="{ object }">
				<v-btn color="primary" @click="saveStockLog(object)">保存</v-btn>
			</template>
		</BeanStockLogForm>
	</v-dialog>
</template>

<script>
import { BeanForm, BeanList, BeanBatchForm, BeanStockLogForm } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	name: 'bean-manage',
	components: { BeanForm, BeanList, BeanBatchForm, BeanStockLogForm },
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			query: qps,
			refs: {},
			editingObj: {},
			objects: [],
			total: 0,
			showEditor: false,
			loading: false,
			options: {},
			formDlg: false,
			form: {},
			outDlg: false,
			outForm: {},
			outErrors: {},
			errors: {},

			batchForm: {},
			batchErrors: {},
			batchDlg: false,
			taggingDlg: false,
			taggingObj: {},
			taggingTags: [], //当前对象的全部标签
			taggingGroups: ['冲煮方式', '烘焙程度', '风味', '产地', '处理法', '品种'],
			addTagForm: {
				name: '',
				group: ''
			},
			tags: []
		}
	},
	mounted() {
		this.loadTagGroups()
	},
	computed: {
		tagsByGroup() {
			let map = {}
			this.tags.forEach((tag) => {
				if (!map[tag.group_id]) map[tag.group_id] = []
				map[tag.group_id + ''].push(tag)
			})
			return map
		},
		tagNames() {
			let names = []
			this.tags.forEach((tag) => {
				if (!names.includes(tag.name)) names.push(tag.name)
			})
			return names
		}
	},
	watch: {},
	methods: {
		loadTagGroups() {
			this.$http2.get(`/tag/getGroups`, { params: { type: 'bean' } }).then((r) => {
				this.taggingGroups = r
			})
		},
		loadTags(obj) {
			this.$http2.get(`/tag/getTags`, { params: { type: 'bean', id: obj.id } }).then((r) => {
				this.tags = r
			})
		},
		addTagByForm() {
			this.addTag(this.addTagForm)
		},
		addTag(tag) {
			let data = {
				name: tag.name,
				target_id: this.taggingObj.id + '',
				target_type: 'bean'
			}
			if (tag.group_name) {
				data.group_name = tag.group_name
			}
			if (tag.group_id) {
				data.group_id = tag.group_id
			}
			this.$http2.post(`/tag/add`, data).then((r) => {
				this.loadTags(this.taggingObj)
				this.loadTagGroups()
			})
		},
		removeTag(tag_id) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					this.$http2
						.get(`/tag/remove`, { params: { target_type: 'bean', target_id: this.taggingObj.id, tag_id } })
						.then((r) => {
							this.loadTags(this.taggingObj)
							this.loadTagGroups()
						})
				}
			})
		},
		load() {
			this.$refs.thelist.load()
		},
		tagging(obj) {
			this.taggingDlg = true
			this.taggingObj = obj
			this.loadTags(obj)
		},
		add() {
			this.form = {}
			this.formDlg = true
		},
		edit(item) {
			this.form = clone(item)
			this.formDlg = true
		},
		save(form) {
			form.status = 'valid'
			this.$api.bean.update(
				form,
				(r) => {
					this.load()
					this.formDlg = false
				},
				(e) => {
					this.errors = e.data
				}
			)
		},
		inStock(bean) {
			this.batchForm = {
				bean_id: bean.id,
				date: format(new Date(), 'yyyy-MM-dd')
			}
			this.batchDlg = true
		},
		outStock(bean) {
			this.outDlg = true
			this.outForm = {
				bean_id: bean.id,
				date: format(new Date(), 'yyyy-MM-dd'),
				type: 'out'
			}
		},
		saveStockLog(log) {
			this.$api.bean.updateStockLog(
				log,
				(r) => {
					this.load()
					this.outDlg = false
				},
				(e) => {
					this.outErrors = e.message
				}
			)
		},
		price(bean) {
			this.goTo(`/bean/price/?beanid=${bean.id}`)
		},
		saveBatch(form) {
			this.$api.bean.updateBatch(
				form,
				(r) => {
					this.load()
					this.batchDlg = false
				},
				(e) => {
					this.batchErrors = e.data
				}
			)
		},
		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r) {
					this.$api.bean.remove(item.id, (data) => {
						this.load()
					})
				}
			})
		},
		batch(bean) {
			this.goTo(`/bean/batchmanage/?bean_id=${bean.id}`)
		}
	}
}
</script>

<style scoped></style>
