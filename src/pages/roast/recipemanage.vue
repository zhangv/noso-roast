<template>
	<div>
		<v-card-title class="d-flex align-center">
			烘焙方案管理
			<template v-if="bean && bean.name">
				<span class="ml-2">{{ bean.name }}</span>
			</template>
			<v-icon color="info" @click="load">mdi-reload</v-icon>
		</v-card-title>
		<RoastRecipeList ref="thelist" show-select :single-select="false" :init-query="query" :headers="headers">
			<template v-slot:batchActions="{ selected }"></template>
			<template v-slot:actions="{ item }">
				<v-icon class="mr-2" @click="edit(item)">$edit</v-icon>
			</template>
		</RoastRecipeList>
		<v-dialog v-model="editingDlg">
			<RoastRecipeForm v-model:value="editingObj" :errors="editingErrors">
				<template #actions="{ object }">
					<v-btn color="primary" @click="confirmEdit(object)">保存</v-btn>
				</template>
			</RoastRecipeForm>
		</v-dialog>
	</div>
</template>

<script>
import { BeanSelector, RoastRecipeList, RoastRecipeForm } from '@ui'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: {
		RoastRecipeList,
		BeanSelector,
		RoastRecipeForm
	},
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			query: qps,
			refs: {},
			// bean: {},
			editingObj: {},
			objects: [],
			total: 0,
			editingDlg: false,
			editingErrors: {},
			loading: false,
			options: {},
			headers: [
				{ title: '#', sortable: true, value: 'id' },
				{ title: '名称', align: 'left', sortable: true, value: 'name' },
				{ title: '生豆', value: 'bean_id' },
				{ title: '烘焙度', value: 'degree' },
				{ title: '状态', sortable: true, value: 'status' },
				{
					title: '',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			]
		}
	},
	mounted() {
		if (this.query.bean_id) {
			this.$api.bean.getById(this.query.bean_id, (r) => {
				this.bean = r
				this.load()
			})
		} else this.load()
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$refs.thelist.load()
		},
		detail(o) {
			this.detailDlg = true
			this.$api.roast.getRecipeById(o.id, (r) => {
				this.detailObj = r
			})
		},
		edit(item) {
			this.editingObj = clone(item)
			this.editingDlg = true
			this.editingErrors = {}
		},
		confirmEdit(form) {
			this.$api.roast.updateRecipe(
				form,
				(r) => {
					this.editingDlg = false
					this.load()
					alert('保存成功')
				},
				(e) => {
					this.editingErrors = e.data
				}
			)
		},

		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					let id = item.id
					this.$http.get(`/cupping/delete/` + id).then((data) => {
						this.load()
					})
				}
			})
		}
	}
}
</script>

<style scoped></style>
