<template>
	<div>
		<v-card-title class="d-flex align-center">
			价格等级管理
			<v-icon color="primary" dark @click="add">$plus</v-icon>
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<PriceLevelList
						:headers="headers"
						:bean-id="beanid"
						ref="thelist"
						show-select
						:single-select="false"
						:init-query.sync="query"
					>
						<template v-slot:batchActions="{ selected }"></template>
						<template v-slot:actions="{ item }">
							<v-btn small @click="edit(item)">修改</v-btn>
						</template>
					</PriceLevelList>
				</v-col>
			</v-row>
		</v-card-text>
		<v-dialog v-model="formDlg">
			<price-level-form v-model:value="form" :errors="errors">
				<template #actions="{ object }">
					<v-btn @click="save(object)">保存</v-btn>
				</template>
			</price-level-form>
		</v-dialog>
	</div>
</template>

<script>
import { PriceLevelForm, PriceLevelList } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: { PriceLevelForm, PriceLevelList },
	props: [],
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			beanid: qps['beanid'],
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
				{ title: '#', value: 'id' },
				{ title: '名称', value: 'name' },
				{ title: '折扣', value: 'discount' },
				{ title: '类型', value: 'type' },
				{ title: '状态', value: 'status' },
				{ title: '', align: 'left', sortable: false, value: 'action' }
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
			this.$refs.thelist.load()
		},
		add() {
			this.form = {}
			this.formDlg = true
		},

		save(form) {
			this.$api.price.updateLevel(
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

		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					let id = item.id
					this.$api.price.remove(
						id,
						(data) => {
							this.$notify({
								type: 'success',
								message: '删除成功'
							})
							this.load()
						},
						(r) => {
							this.$notify({
								type: 'error',
								message: r
							})
						}
					)
				}
			})
		}
	}
}
</script>

<style scoped></style>
