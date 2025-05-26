<template>
	<v-card-title class="d-flex align-center">
		杯测评分管理
		<v-icon color="primary" dark @click="add">$plus</v-icon>
		<v-icon color="info" @click="load">$reload</v-icon>
		<v-spacer></v-spacer>
	</v-card-title>
	<CuppingScoreList ref="thelist" show-select :single-select="false" :init-query.sync="query">
		<template v-slot:batchActions="{ selected }"></template>
		<template v-slot:actions="{ item }">
			<v-icon class="mr-2 mb-1" @click="edit(item)">$edit</v-icon>
			<v-icon class="mr-2 mb-1" @click="del(item)" color="error">$delete</v-icon>
			<v-btn @click="samples(item)">详情</v-btn>
		</template>
	</CuppingScoreList>
	<v-dialog v-model="samplesDlg">
		<v-card>
			<v-card-title>杯测样本</v-card-title>
			当前样本列表TODO 添加样本表单TODO
			<v-card-text>
				<v-btn @click="samplesDlg = false">关闭</v-btn>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { CuppingScoreList } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	name: 'cupping-score-manage',
	components: { CuppingScoreList },
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
			samplesDlg: false
		}
	},
	mounted() {},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$refs.thelist.load()
		},
		detail(item) {
			this.goTo(`/cupping/scoredetail?id=${item.id}`)
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
			this.$api.cupping.update(
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
					this.$api.cupping.remove(item.id, (data) => {
						this.load()
					})
				}
			})
		}
	}
}
</script>

<style scoped></style>
