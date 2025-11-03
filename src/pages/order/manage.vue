<template>
	<div>
		<v-dialog v-model="formDlg">
			<order-form :value="form" :errors="errors">
				<template #actions="{ object }">
					<v-card-actions>
						<v-btn color="primary" size="large" @click="save(object)">保存</v-btn>
					</v-card-actions>
				</template>
			</order-form>
		</v-dialog>

		<v-card-title class="d-flex align-center">
			订单管理
			<v-icon color="primary" dark @click="add">$plus</v-icon>
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>
		</v-card-title>
		<OrderList ref="thelist" show-select :single-select="false" :init-query.sync="query">
			<template v-slot:batchActions="{ selected }"></template>
			<template v-slot:actions="{ item }">
				<v-btn small class="mr-1 mb-1" @click="detail(item)">详情</v-btn>
				<template v-if="item.status == 'created'">
					<v-btn small class="mr-1 mb-1" @click="edit(item)">修改</v-btn>
					<v-btn small class="mr-1 mb-1" @click="settle(item)">结算</v-btn>
					<v-btn small class="mr-1 mb-1" @click="remove(item)">删除</v-btn>
				</template>
				<template v-if="item.status == 'placed'">
					<v-btn small class="mr-1 mb-1" @click="settleById(item)">结算</v-btn>
					<v-btn small class="mr-1 mb-1" @click="settle(item)">重新结算</v-btn>
				</template>
				<template v-if="item.status == 'settled'">
					<!-- <v-btn small class="mr-1 mb-1" @click="afterSettle(item)">结算后更新库存(临时)</v-btn> -->
					<v-btn small class="mr-1 mb-1" @click="settleUndo(item)">撤销结算</v-btn>
					<v-btn small class="mr-1 mb-1" @click="refund(item)">退款退货</v-btn>
				</template>
			</template>
		</OrderList>
		<v-dialog v-model="detailDlg">
			<order-detail :value="detailOrder" />
		</v-dialog>
		<v-dialog v-model="settleDlg">
			<settle-form :order="settleOrder" @close="settleDlg = false">
				<template #actions="{ payitems }">
					<v-card-actions>
						<v-btn color="primary" size="large" :disabled="settling" @click="confirmSettle(payitems)">
							结算
						</v-btn>
					</v-card-actions>
				</template>
			</settle-form>
		</v-dialog>
		<v-dialog v-model="refundDlg">
			<refund-form
				:order-no="refundOrder.id"
				:errors="refundErrors"
				@close="refundDlg = false"
				@confirm="confirmRefund"
			>
				<!-- <template #actions="{ payitems }">
					<v-card-actions>
						<v-btn color="primary" size="large" @click="confirmRefund(payitems)">退款退货</v-btn>
					</v-card-actions>
				</template> -->
			</refund-form>
		</v-dialog>
	</div>
</template>

<script>
import { OrderForm, OrderList, OrderSettleForm, OrderRefundForm, OrderDetail } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: { OrderForm, OrderList, SettleForm: OrderSettleForm, RefundForm: OrderRefundForm, OrderDetail },
	props: [],
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			query: qps,
			refs: {},
			editingObj: {},
			objects: [],
			total: 0,
			loading: false,
			options: {},
			formDlg: false,
			form: {},
			errors: {},
			headers: [
				{ text: '#', value: 'id' },
				{ text: '日期', align: 'left', sortable: true, value: 'date' },
				{ text: '客户', value: 'user_id' },
				{ text: '总金额', value: 'totalamt' },
				{ text: '总数量', value: 'totalqty' },
				{
					text: '操作',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			],
			settleDlg: false,
			settleOrder: null,
			settling: false,
			refundDlg: false,
			refundOrder: null,
			refundErrors: {},
			detailDlg: false,
			detailOrder: null
		}
	},
	mounted() {
		this.load()
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$refs.thelist.load()
		},
		add() {
			this.form = {
				date: format(new Date(), 'yyyy-MM-dd')
			}
			this.formDlg = true
		},
		save(form) {
			this.$api.order.create(
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
		edit(order) {
			this.form = clone(order)
			this.formDlg = true
		},
		detail(order) {
			this.detailDlg = true
			this.detailOrder = clone(order)
		},
		refund(order) {
			this.refundDlg = true
			this.refundOrder = clone(order)
		},
		confirmRefund(form) {
			console.log('confirmRefund', form)
			this.$api.order.refund(
				form,
				(r) => {
					this.load()
				},
				(e) => {
					this.refundErrors = e.data
				}
			)
		},
		settle(order) {
			this.settleDlg = true
			this.settleOrder = clone(order)
		},
		settleById(order) {
			this.$api.order.settle(
				{
					order_id: order.id,
					orderpayment_id: order.orderpayment_id
				},
				(r) => {
					this.load()
					this.settleDlg = false
					this.settling = false
				},
				(e) => {
					this.errors = e.data
					this.settling = false
				}
			)
		},
		confirmSettle(payitems) {
			this.settling = true
			this.$api.order.settle(
				{
					order_id: this.settleOrder.id,
					payitems
				},
				(r) => {
					this.load()
					this.settleDlg = false
					this.settling = false
				},
				(e) => {
					this.errors = e.data
					this.settling = false
				}
			)
		},
		settleUndo(order) {
			this.$confirm(`确定要撤销结算吗？账户记录和库存会恢复。`).then((r) => {
				if (r) {
					this.$api.order.settleUndo(
						order.id,
						(r) => {
							this.load()
						},
						(e) => {
							this.errors = e.data
						}
					)
				}
			})
		},
		afterSettle(order) {
			this.$http
				.post(`/order/afterSettle/${order.id}`)
				.then((r) => {
					this.load()
				})
				.catch((e) => {
					this.errors = e.data
					console.log(e)
					this.$alert(e.message)
				})
		},
		remove(order) {
			this.$confirm(`确定要删除订单吗？`).then((r) => {
				if (r) {
					this.$api.order.remove(
						order.id,
						(r) => {
							this.load()
						},
						(e) => {
							this.errors = e.data
						}
					)
				}
			})
		}
	}
}
</script>

<style scoped></style>
