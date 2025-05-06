<template>
	<v-card>
		<v-card-title>
			<span class="text-h6">杯测</span>
			{{ cupping.location }}
			样本数量：{{ cupping.samplecount }} 评分次数：{{ cupping.scorecount }}
			<v-btn @click="editCupping">编辑</v-btn>
		</v-card-title>
		<v-card-text>
			<v-row>
				<template v-for="sample in samples">
					<v-col cols="12" sm="6" md="4">
						<sample-card :sample="sample">
							<template #actions="{ sample }">
								<v-btn color="primary" @click="sampleDetail(sample.id)">评分</v-btn>
								<v-btn @click="editSample(sample)">编辑</v-btn>
							</template>
						</sample-card>
					</v-col>
				</template>
			</v-row>
		</v-card-text>
	</v-card>
	<v-dialog v-model="formDlg">
		<v-card>
			<v-card-title>编辑杯测信息</v-card-title>
			<v-card-text>
				<cupping-form v-model:value="form" :errors="errors">
					<template #actions="{ object }">
						<v-btn color="primary" large @click="save(object)">保存</v-btn>
						<v-btn color="" large @click="formDlg = false">关闭</v-btn>
					</template>
				</cupping-form>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script>
import { CuppingForm, CuppingSampleCard } from '@ui'
import { clone } from 'lodash-es'
import qs from 'qs'

export default {
	components: { CuppingForm, SampleCard: CuppingSampleCard },
	props: [],
	data() {
		const qps = qs.parse(this.$route.query)
		return {
			id: qps.id,
			cupping: {},
			formDlg: false,
			form: {},
			errors: {},
			sampleId: qps.sample_id,
			samples: {}
		}
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.$api.cupping.getById(`${this.id}`, (r) => {
				this.cupping = r
				this.loadSamples(this.cupping.id)
			})
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
		loadSamples(cupping_id) {
			this.$api.cupping.searchSample({ cupping_id }, (r) => {
				this.samples = r.objects
			})
		},
		highlightSample(sample_id) {
			this.sampleId = sample_id
		},
		sampleDetail(sample_id) {
			this.goTo(`/cupping/sample?id=${sample_id}`)
		},
		editSample(sample) {
			this.sampleId = sample.id
		},
		editCupping() {
			this.form = clone(this.cupping)
			this.formDlg = true
		}
	}
}
</script>
