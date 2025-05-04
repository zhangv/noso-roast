<template>
	<v-card-title class="d-flex align-center">
		供应商管理
		<v-icon color="primary" dark @click="add">$plus</v-icon>
		<v-icon color="info" @click="load">$reload</v-icon>
		<v-spacer></v-spacer>
	</v-card-title>
	<SupplierList ref="thelist" show-select :single-select="false">
		<template v-slot:batchActions="{ selected }"></template>
		<template v-slot:actions="{ item }">
			<v-icon class="mr-2 mb-1" @click="edit(item)">$edit</v-icon>
			<v-icon class="mr-2 mb-1" @click="del(item)" color="error">$delete</v-icon>
		</template>
	</SupplierList>

	<v-dialog v-model="formDlg">
		<v-card>
			<v-card-title>编辑供应商信息</v-card-title>
			<v-card-text>
				<supplier-form v-model:value="form" :errors="errors">
					<template #actions="{ object }">
						<v-btn color="primary" large @click="save(object)">保存</v-btn>
						<v-btn color="" large @click="formDlg = false">关闭</v-btn>
					</template>
				</supplier-form>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { SupplierForm, SupplierList } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	name: 'supplier-manage',
	components: { SupplierForm, SupplierList },
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
			errors: {},

			batchForm: {},
			batchErrors: {},

			tags: []
		}
	},
	mounted() {},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$refs.thelist.load()
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
			this.$api.supplier.update(
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

		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r) {
					this.$api.bean.remove(item.id, (data) => {
						this.load()
					})
				}
			})
		}
	}
}
</script>

<style scoped></style>
