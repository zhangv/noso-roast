<template>
	<v-card-title class="d-flex align-center">
		生豆管理
		<v-icon color="primary" dark @click="add">$plus</v-icon>
		<v-icon color="info" @click="load">mdi-refresh</v-icon>
		<v-spacer></v-spacer>
		<span style="font-size: 0.8rem">
			{{ total.total }} 种
			<span style="color: green">
				生豆：{{ total.greenCount }}种 /{{ total.greenTotal }}克 /{{ total.greenTotalAmount }}元
			</span>
			<span style="color: brown">
				熟豆：{{ total.roastedCount }}种 /{{ total.roastedTotal }}克 /{{ total.roastedTotalAmount }}元
			</span>
		</span>
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
			<v-btn class="mr-2 mb-1" small @click="goTo(`/roast/recipemanage/?bean_id=${item.id}`)">烘焙方案</v-btn>
			<v-btn class="mr-2 mb-1" small @click="goTo(`/cupping/scoremanage/?bean_id=${item.id}`)">杯测评分</v-btn>
		</template>
	</BeanList>
	<v-dialog v-model="taggingDlg" :persistent="false">
		<v-card>
			<tagger :id="taggingObj.id" type="bean"></tagger>
			<v-card-actions>
				<v-btn color="primary" @click="taggingDlg = false">关闭</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
	<v-dialog v-model="formDlg" :persistent="false">
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
	<v-dialog v-model="batchDlg" :persistent="false">
		<v-card>
			<v-card-title>批次入库</v-card-title>
			<bean-batch-form v-model:value="batchForm" :errors="batchErrors">
				<template #actions="{ object }">
					<v-btn color="primary" large @click="saveBatch(object)">保存</v-btn>
					<v-btn color="" large @click="batchDlg = false">关闭</v-btn>
				</template>
			</bean-batch-form>
		</v-card>
	</v-dialog>
	<v-dialog v-model="outDlg" max-width="80%">
		<BeanStockLogForm v-model:value="outForm" :errors="outErrors">
			<template #actions="{ object }">
				<v-btn color="primary" @click="saveStockLog(object)">保存</v-btn>
			</template>
		</BeanStockLogForm>
	</v-dialog>
	<!-- <CycleEditor v-model="form.cycle" /> -->
</template>

<script>
import { BeanForm, BeanList, BeanBatchForm, BeanStockLogForm, Tagger, CycleEditor } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	name: 'bean-manage',
	components: { BeanForm, BeanList, BeanBatchForm, BeanStockLogForm, Tagger, CycleEditor },
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
			form: {
				// cycle: '2025:*:*:*:*:*:00,1'
			},
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
		this.loadTotal()
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$refs.thelist.load()
			this.loadTotal()
		},
		loadTotal() {
			this.$api.bean.getTotal((r) => {
				this.total = r
			})
		},
		tagging(obj) {
			this.taggingDlg = true
			this.taggingObj = obj
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
			//出库
			this.$api.bean.updateStockLog(
				log,
				(r) => {
					console.log('r', r)
					this.load()
					this.outDlg = false
				},
				(e) => {
					this.$alert(e.message)
					this.outErrors = e.data
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
