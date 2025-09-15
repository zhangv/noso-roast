<template>
	<div>
		<v-card-title class="d-flex align-center">
			豆批次变动记录
			<template v-if="bean">
				({{ bean.name }})
				<span style="color: green">
					{{ bean.rawstock }}
				</span>
				/
				<span style="color: brown; font-weight: bolder; font-size: 1.2rem">{{ bean.roastedstock }}</span>
			</template>
			<v-icon color="info" @click="load">$reload</v-icon>
		</v-card-title>
		<v-card-text>
			<BeanBatchLogList :bean-id="beanid" ref="stocklist" :single-select="false">
				<template v-slot:batchActions="{ selected }"></template>
				<template v-slot:actions="{ item }"></template>
			</BeanBatchLogList>
		</v-card-text>
	</div>
</template>

<script>
import { BeanBatchLogList } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: { BeanBatchLogList },
	props: [],
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			beanid: qps['bean_id'],
			batchid: qps['id'],
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
				{ text: '变动数量', value: 'totalQty' },
				{ text: '当前数量', value: 'currentQty' },
				{ text: '类型', value: 'type' },
				{
					text: '操作',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			]
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
