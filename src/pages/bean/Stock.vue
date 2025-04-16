<template>
	<v-sheet>
		<v-card-title class="d-flex align-center">
			豆库存
			<v-icon color="primary" dark @click="add">$plus</v-icon>
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>
		</v-card-title>
	</v-sheet>
</template>

<script>
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: {},
	prop: ['beanid'],
	data() {
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
			stocks: []
		}
	},
	created() {},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$api.raost.searchBeanStock(params, (r) => {
				this.stocks = r
			})
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
			this.$api.roast.updateBean(
				form,
				(r) => {
					this.load()
				},
				(e) => {
					this.errors = e.message
				}
			)
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
		},
		stock(bean) {
			this.goTo(`/roast/beanstock/${bean.id}`)
		}
	}
}
</script>

<style scoped></style>
