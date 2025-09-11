<template>
	<v-form v-model="valid">
		<v-card>
			<report-form v-if="form" v-model="form" :key="form.id">
				<template #actions="{ object }">
					<v-card-actions style="bottom: 0; position: fixed; background-color: white; width: 100%">
						<v-btn @click="save(object)">保存</v-btn>
					</v-card-actions>
				</template>
			</report-form>
		</v-card>
	</v-form>
</template>

<script>
import { ReportForm } from '@ui'

export default {
	components: { ReportForm },
	props: ['id'],
	data: () => ({
		form: null,
		valid: true,
		statuses: [],
		errors: {},
		temp: null
	}),
	watch: {},
	mounted() {
		this.getForm(this.id)
	},
	methods: {
		getForm(id) {
			this.$api.report.getById(id, (r) => {
				r.columns = r.columns.map((p) => {
					delete p.id
					delete p.report_id
					return p
				})
				r.parameters = r.parameters.map((p) => {
					delete p.id
					delete p.report_id
					return p
				})
				r.id = null
				this.form = r
			})
		},

		save(form) {
			this.$api.report.update(
				form,
				(response) => {
					alert('保存成功')
				},
				(error) => {
					alert(error)
				}
			)
		},
		clear() {
			this.form = {}
		}
	}
}
</script>
