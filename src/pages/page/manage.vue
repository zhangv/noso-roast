<template>
	<div>
		<v-card-title class="d-flex align-center">
			页面管理
			<v-icon color="primary" @click="edit({})">$plus</v-icon>
			<v-icon color="info" @click="load">$reload</v-icon>
		</v-card-title>
		<PageList ref="thelist" show-select :single-select="false" :init-query.sync="query" :headers="headers">
			<template v-slot:batchActions="{ selected }"></template>
			<template v-slot:actions="{ item }">
				<v-icon class="mr-2" @click="detail(item)">$eye</v-icon>
				<v-icon class="mr-2" @click="edit(item)">$edit</v-icon>
				<v-icon class="mr-2" @click="del(item)" color="error">$delete</v-icon>
			</template>
		</PageList>
		<!-- <v-dialog v-model="editDlg"> -->
		<v-card>
			<PageForm v-model:value="editingObj" :errors="errors">
				<template #actions="{ object }">
					<v-card-actions>
						<v-btn v-debounce color="primary" large @click="confirmEdit(object)">确认保存</v-btn>
					</v-card-actions>
				</template>
			</PageForm>
		</v-card>
		<!-- </v-dialog> -->

		<v-dialog v-model="detailDlg">
			<v-card>
				<v-card-title>页面详情</v-card-title>
				<v-card-text>
					{{ detailObj.content }}
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { PageList, PageForm } from '@ui'
import qs from 'qs'

export default {
	components: {
		PageList,
		PageForm
	},
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })

		return {
			query: qps,
			refs: {},
			editingObj: {},
			objects: [],
			total: 0,
			editDlg: false,
			loading: false,
			options: {},

			detailId: null,
			detailDlg: false,
			detailObj: {},
			headers: [
				{ title: '#', sortable: true, value: 'id' },
				{ title: '编码', value: 'code', sortable: true },
				{ title: '标题', align: 'left', sortable: true, value: 'title' },
				{ title: '作者', sortable: true, value: 'author' },
				{ title: '状态', sortable: true, value: 'status' },
				{ title: '分类', sortable: true, value: 'category_path' },
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
		this.load()
	},
	computed: {},
	watch: {},
	methods: {
		edit(o) {
			this.editingObj = o
			this.editDlg = true
		},
		confirmEdit(o) {
			console.log('confirmedit', o.content)
			this.$api.page.update(o, (r) => {
				alert(`修改成功`)
				this.load()
			})
		},
		load() {
			this.$refs.thelist.load()
		},
		detail(o) {
			this.detailDlg = true
			this.$api.page.getById(o.id, (r) => {
				this.detailObj = r
			})
		},
		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					let id = item.id
					this.$api.page.remove(id, (data) => {
						this.load()
					})
				}
			})
		}
	}
}
</script>

<style scoped></style>
