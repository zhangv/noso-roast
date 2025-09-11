<template>
	<v-card elevation="0">
		<v-card-title>
			<template v-if="report">
				图表管理 - {{ report.name }}
				<v-icon @click="create" color="primary">$plus</v-icon>
				<v-icon @click="createMulti" color="primary">mdi-chart-multiple</v-icon>
				<v-icon @click="load" color="primary">$reload</v-icon>
			</template>
			<template v-else>全部图表</template>
		</v-card-title>
		<v-card-subtitle>
			<v-form @submit.prevent="load" classx="d-flex align-center">
				<v-text-field
					v-model="query.name"
					label="名称"
					clearable
					hide-details
					style="width: 15rem"
					class="d-inline-block mr-2"
				></v-text-field>
				<v-text-field
					v-model="query.code"
					label="编码"
					clearable
					hide-details
					style="width: 15rem"
					class="d-inline-block mr-2"
				></v-text-field>
				<v-select
					outlined
					dense
					label="类型"
					:items="refs['ChartType']"
					style="max-width: 8rem"
					class="d-inline-block mr-2"
					clearable
					hide-details
					v-model="query.type"
					item-text="title"
					item-value="value"
				></v-select>
				<v-select
					outlined
					dense
					label="状态"
					:items="refs['ChartStatus']"
					style="max-width: 8rem"
					class="d-inline-block mr-2"
					clearable
					hide-details
					v-model="query.status"
					item-text="title"
					item-value="value"
				></v-select>

				<v-btn color="primary" @click="load"><v-icon>$search</v-icon></v-btn>
			</v-form>
		</v-card-subtitle>
		<v-data-table
			:headers="headers"
			:items="objects"
			:options.sync="options"
			:server-items-length="parseInt(total)"
			:loading="loading"
			:footer-props="{
				showFirstLastPage: true,
				showCurrentPage: true,
				itemsPerPageOptions: [10, 20, 30]
			}"
		>
			<template v-slot:item.report="{ item }">
				<a href="#" @click="goTo(`/report/detail/${item.report.id}`)">
					{{ item.report ? item.report.name : 'error' }}
				</a>
			</template>
			<template v-slot:item.name="{ item }">{{ item.name }}（{{ item.code }}）</template>
			<template v-slot:item.status="{ item }">
				{{ item.status }}
			</template>
			<template v-slot:item.type="{ item }">
				{{ item.type }}
			</template>
			<template v-slot:item.action="{ item }">
				<v-btn @click="detail(item)" small class="mr-2">查看</v-btn>
				<v-icon @click="edit(item)" class="mr-2">$edit</v-icon>
				<v-icon @click="copy(item)" class="mr-2">$copy</v-icon>
				<v-icon @click="del(item)" color="error" class="mr-2">$delete</v-icon>
			</template>
		</v-data-table>

		<v-dialog v-model="showEditor" max-width="500">
			<v-card>
				<chart-form v-model="editingObj" v-if="editingObj" :key="editingObj.id">
					<template v-slot:actions="{ object }">
						<v-btn large @click="save(object)" color="primary">保存</v-btn>
					</template>
				</chart-form>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
import { ReportChartForm as ChartForm } from '@ui'
import { clone } from 'lodash-es'

export default {
	name: 'chartform',
	components: { ChartForm },
	props: ['reportid'],
	data() {
		return {
			report: null,
			query: {},
			editingObj: {},
			objects: [],
			total: 0,
			showEditor: false,
			loading: false,
			options: {},
			headers: [
				{ text: '#', value: 'id' },
				{
					text: '报表',
					align: 'left',
					sortable: true,
					value: 'report'
				},
				{ text: '名称', align: 'left', sortable: true, value: 'name' },
				{ text: '类型', value: 'type' },
				{ text: '状态', value: 'status' },
				{
					text: '',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			],
			refs: {}
		}
	},
	mounted() {
		if (this.reportid) {
			this.loadReport()
		}
		this.load()
		this.$http2.get(`/report/meta/ChartStatus,ChartType`).then((r) => {
			this.refs = r
		})
	},
	computed: {},
	watch: {
		options: {
			handler() {
				this.load()
			},
			deep: true
		}
	},
	methods: {
		detail(i) {
			this.goTo(`/report/chart/${i.id}`)
		},
		create() {
			this.editingObj = {
				report_id: this.reportid,
				colNames: []
			}
			this.showEditor = true
		},
		createMulti() {
			this.editingObj = {
				report_id: this.reportid,
				colNames: []
			}
			this.chartMultiDlg = true
		},
		loadReport() {
			this.$api.report.getById(this.reportid, (response) => {
				this.report = response
			})
		},
		load() {
			const { sortBy, sortDesc, page, itemsPerPage } = this.options
			this.loading = false

			var qwp = clone(this.query)
			qwp.report_id = this.reportid
			qwp.pageno = page
			qwp.pagesize = itemsPerPage
			qwp.sortBy = 'id'
			if (sortBy && sortBy.length > 0) qwp.sortBy = sortBy[0]
			qwp.sortDesc = 'desc'
			if (sortDesc && sortDesc.length > 0) qwp.sortDesc = sortDesc[0] === false ? 'desc' : 'asc'

			this.$api.report.searchChart(qwp, (response) => {
				this.objects = response.objects
				this.total = response.total
			})
		},
		edit(item) {
			this.$api.report.getChartById(`${item.id}`, (r) => {
				this.editingObj = r
				this.showEditor = true
			})
		},
		copy(item) {
			this.goTo(`/report/chartcopy/${item.id}`)
		},
		save(form) {
			this.$api.report.updateChart(form, (r) => {
				alert('保存成功')
				this.showEditor = false
				this.load()
			})
		},
		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (!r) return
				this.$api.report.removeChart(item.id, (r) => {
					const index = this.objects.findIndex((e) => e.id === item.id)
					if (index >= 0) this.objects.splice(index, 1)
				})
			})
		}
	}
}
</script>

<style scoped></style>
