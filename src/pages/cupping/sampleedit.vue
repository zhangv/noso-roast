<template>
	<div>
		<v-card-title>
			样本修改
			<a :href="`/cupping/detail?id=${sample.cupping_id}`">杯测</a>
		</v-card-title>
		<CuppingSampleForm :value="sample">
			<template #actions="{ object }">
				<v-btn color="primary" @click="submitSample(object)">提交</v-btn>
			</template>
		</CuppingSampleForm>
	</div>
</template>
<script>
import { CuppingSampleForm } from '@ui'
import qs from 'qs'

export default {
	name: 'CuppingSample',
	components: {
		CuppingSampleForm
	},

	props: [],
	data() {
		const qps = qs.parse(this.$route.query)
		return {
			sampleId: qps.id,
			sample: {}
		}
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.$api.cupping.getSampleById(`${this.sampleId}`, (r) => {
				this.sample = r
			})
		},
		submitSample(object) {
			let form = {
				...object,
				cuppingsample_id: this.sample.id,
				cupping_id: this.sample.cupping_id
			}
			this.$api.cupping.updateSample(form, (r) => {
				this.load()
			})
		}
	}
}
</script>
