<template>
	<v-card elevation="0">
		<v-card-title>
			报表管理
			<v-icon color="primary" @click="create">$plus</v-icon>
			<v-icon color="primary" @click="load">$reload</v-icon>
		</v-card-title>

		<v-card-text>
			<v-form @submit.prevent="load">
				<v-text-field
					v-model="query.name"
					:error-messages="errors.name"
					label="名称"
					clearable
					hide-details
					style="width: 20rem"
					class="d-inline-block"
				></v-text-field>
				<v-btn color="primary" small @click="load"><v-icon>$search</v-icon></v-btn>
				<template v-if="favs && favs.length > 0">
					<template v-for="(fav, i) in favs">
						<v-chip
							class="mr-1 mb-1"
							close
							color="primary"
							close-icon="$delete"
							@click:close="removeFav(fav)"
							@click="goTo(`/report/detail/${fav.id}`)"
						>
							{{ fav.name }}
						</v-chip>
					</template>
				</template>
			</v-form>
		</v-card-text>
		<ReportList ref="thelist" show-select :single-select="false">
			<template v-slot:actions="{ item }">
				<!--				<v-btn @click="detail(item)" color="primary" class="mr-1">生成</v-btn>-->
				<v-btn @click="$router.push('/report/chartmanage?report_id=' + item.id)" class="mr-1 mb-1">图表</v-btn>
				<v-icon @click="edit(item)" class="mr-1 mb-1">$edit</v-icon>
				<v-icon @click="del(item)" color="error" class="mr-1 mb-1">$delete</v-icon>
				<v-icon @click="copy(item)" class="mr-1 mb-1">mdi-content-copy</v-icon>
				<v-icon @click="removeFav(item)" class="mr-1 mb-1" v-if="favIds.includes(item.id)">mdi-star</v-icon>
				<v-icon @click="addFav(item)" class="mr-1 mb-1" v-else>mdi-star-outline</v-icon>
			</template>
		</ReportList>
	</v-card>
	<v-dialog v-model="formDlg" :persistent="false">
		<v-card>
			<v-card-title>报表编辑</v-card-title>

			<v-icon style="position: absolute; right: 10px; top: 10px" @click="formDlg = false">$close</v-icon>
			<report-form v-model:value="editingObj" :errors="errors">
				<template #actions="{ object }">
					<v-btn color="primary" large @click="save(object)">保存</v-btn>
				</template>
			</report-form>
		</v-card>
	</v-dialog>
</template>

<script>
import { ReportList, ReportForm } from '@ui'
import { clone } from 'lodash-es'

export default {
	components: { ReportList, ReportForm },
	data() {
		return {
			query: {},
			editingObj: {},
			errors: {},
			objects: [],
			total: 0,
			selected: [],
			formDlg: false,
			loading: false,
			headers: [
				{ text: '#', value: 'id' },
				{
					text: '名称',
					align: 'left',
					sortable: true,
					value: 'name'
				},
				{ text: '修改时间', value: 'updated_at' },
				// { text: '类型', value: 'type' },
				{ text: '状态', value: 'status' },
				{
					text: '',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			],
			favs: []
		}
	},
	mounted() {
		this.loadFavs()
		this.load()
	},
	computed: {
		favIds() {
			let ids = []
			this.favs.forEach((e) => ids.push(e.id))
			return ids
		}
	},
	watch: {},
	methods: {
		loadFavs() {
			this.$api.favorite.search(
				{
					pageno: 1,
					pagesize: 20,
					type: 'Report'
				},
				(r) => (this.favs = r.objects)
			)
		},
		addFav(item) {
			this.$api.favorite.add(item.id, 'Report', (r) => {
				alert('收藏成功')
				this.loadFavs()
			})
		},
		removeFav(item) {
			this.$api.favorite.remove(item.id, 'Report', (r) => {
				alert('取消收藏成功')
				this.loadFavs()
			})
		},
		detail(i) {
			this.$router.push(`/report/detail?id=${i.id}`)
		},
		create() {
			this.editingObj = {}
			this.formDlg = true

			this.errors = {}
		},
		load() {
			this.$refs.thelist.load()
		},
		edit(item) {
			this.editingObj = clone(item)
			this.formDlg = true
			this.errors = {}
		},
		copy(item) {
			// this.$router.push('/report/copy/' + item.id)
			this.editingObj = clone(item)
			delete this.editingObj.id
			this.formDlg = true
			this.errors = {}
		},
		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (!r) return
				let id = item.id
				var tostatus = 'invalid'
				this.$api.report.status(id, tostatus, (data) => {
					const index = this.objects.findIndex((e) => e.id === data.id)
					if (index >= 0) this.objects.splice(index, 1)
				})
			})
		},
		save(form) {
			this.$api.report.update(
				form,
				(r) => {
					this.load()
					this.formDlg = false
				},
				(err) => {
					console.log(err)
					this.errors = err.data
				}
			)
		}
	}
}
</script>

<style scoped></style>
