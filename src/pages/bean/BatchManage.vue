<template>
	<div>
		<v-card-title class="d-flex align-center">
			豆批次管理
			<template v-if="bean">
				({{ bean.name }})
				<span style="color: green">
					{{ bean.rawstock }}
				</span>
				/
				<span style="color: brown; font-weight: bolder; font-size: 1.2rem">{{ bean.roastedstock }}</span>
			</template>
			<v-icon color="primary" dark @click="add">$plus</v-icon>
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="12" xl="6">
					<BeanBatchList :bean-id="beanid" ref="thelist" show-select :single-select="false">
						<template v-slot:batchActions="{ selected }"></template>
						<template v-slot:actions="{ item }">
							<v-btn small @click="edit(item)" class="mr-1">详情</v-btn>
							<template v-if="item.status == 'valid'">
								<v-btn small @click="batchlog(item)" class="mr-1">变动日志</v-btn>
								<v-btn small @click="undo(item)" class="mr-1" color="error">撤销</v-btn>
							</template>
						</template>
					</BeanBatchList>
				</v-col>
				<v-col cols="12" xl="6">
					<BeanStockLogList title="库存变动历史" :bean-id="beanid" ref="stocklist" :single-select="false">
						<template v-slot:batchActions="{ selected }"></template>
						<template v-slot:actions="{ item }">
							<v-btn small @click="stocklog(item)">详情</v-btn>
						</template>
					</BeanStockLogList>
				</v-col>
			</v-row>
		</v-card-text>
		<v-dialog v-model="formDlg">
			<v-card>
				<v-card-title>批次详情</v-card-title>
				<v-card-text>
					<bean-batch-form v-model:value="form" :errors="errors">
						<template #actions="{ object }">
							<!-- <v-btn @click="save(object)">保存</v-btn> -->
						</template>
					</bean-batch-form>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-dialog v-model="batchlogDlg">
			<bean-batch-log-list :batch-id="batch.id" ref="batchloglist" :single-select="false">
				<template #actions="{ item }">
					<!-- <v-btn small @click="batchlog(item)">详情</v-btn> -->
				</template>
			</bean-batch-log-list>
		</v-dialog>
	</div>
</template>

<script>
import { BeanBatchForm, BeanBatchList, BeanStockLogList, BeanBatchLogList } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: { BeanBatchForm, BeanBatchList, BeanStockLogList, BeanBatchLogList },
	props: [],
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			beanid: qps['bean_id'],
			bean: {},
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
			errors: {},
			headers: [
				{ text: '#', value: 'id' },
				{ text: '日期', align: 'left', sortable: true, value: 'date' },
				{ text: '豆类型', value: 'beantype' },
				{ text: '总数量', value: 'totalQty' },
				{ text: '当前数量', value: 'currentQty' },
				{ text: '类型', value: 'type' },
				{
					text: '操作',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			],
			batchlogDlg: false,
			batch: null
		}
	},
	mounted() {
		this.load()
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.loadBean()
			this.$refs.thelist.load()
			this.$refs.stocklist.load()
		},
		loadBean() {
			this.$api.bean.getById(this.beanid, (r) => {
				this.bean = r
			})
		},
		add() {
			this.form = {
				date: format(new Date(), 'yyyy-MM-dd'),
				bean_id: this.beanid,
				totalQty: null,
				type: null
			}
			this.formDlg = true
		},

		save(form) {
			this.$api.bean.updateBatch(
				form,
				(r) => {
					this.load()
					this.formDlg = false
				},
				(e) => {
					this.errors = e.message
				}
			)
		},
		edit(batch) {
			this.form = clone(batch)
			this.formDlg = true
		},
		batchlog(batch) {
			this.batch = batch
			this.batchlogDlg = true
		},
		undo(batch) {
			this.$confirm('确定要撤销吗？').then((r) => {
				if (r === true) {
					this.$api.bean.undoBatch(batch.id, (r) => {
						this.load()
					})
				}
			})
		},
		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					let id = item.id
					this.$api.roast.remove(id, (data) => {
						const index = this.objects.findIndex((e) => e.ID === id)
						if (index >= 0) this.objects.splice(index, 1)
					})
				}
			})
		}
	}
}
</script>

<style scoped></style>
