<template>
	<ReportChartForm v-if="form" v-model="form" :errors="errors" :key="form.id">
		<template v-slot:actions="{ object }">
			<v-btn @click="save(object)" color="primary">保存</v-btn>
		</template>
	</ReportChartForm>
</template>

<script>
import { ReportChartForm } from '@ui'

export default {
	components: { ReportChartForm },
	props: ['id'],
	data: () => ({
		form: null,
		statuses: [],
		errors: {}
	}),
	watch: {},
	mounted() {
		this.getForm()
	},
	methods: {
		getForm() {
			this.$api.report.getChartById(`${this.id}`, (r) => {
				this.form = r
				this.form.id = null
			})
		},
		save(form) {
			this.$api.report.updateChart(
				form,
				(response) => {
					alert('保存成功')
				},
				(e) => {
					this.errors = e.message
				}
			)
		},
		clear() {
			this.form = {}
		}
	}
}
</script>
