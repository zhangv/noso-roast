<template>
	<v-card elevation="0">
		<ReportChartForm v-if="form" v-model="form" :errors="errors" :key="form.id">
			<template v-slot:actions="{ object }">
				<v-btn @click="save(object)" color="primary">保存</v-btn>
			</template>
		</ReportChartForm>
	</v-card>
</template>

<script>
import { ReportChartForm } from '@ui'

export default {
	components: { ReportChartForm },
	props: {
		id: { type: [String, Number], default: null }
	},
	data: () => ({
		form: {
			colNames: [],
			params: []
		},
		errors: {}
	}),
	watch: {},
	created() {
		if (this.id) this.getForm(this.id)
	},
	methods: {
		getForm(id) {
			this.$api.report.getChartById(`${id}`, (r) => {
				this.form = r
			})
		},
		save(obj) {
			this.$api.report.updateChart(
				obj,
				(r) => {
					// this.goTo(`/report/chartupdate/${r.id}`)
					alert('保存成功')
					this.goBack()
				},
				(error) => {
					console.log(error)
					// alert(error)
					this.errors = error.message
				}
			)
		},
		clear() {
			this.form = {}
		}
	}
}
</script>
