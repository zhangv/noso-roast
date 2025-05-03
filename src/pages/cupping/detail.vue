<template>
	<div>
		<v-card>
			<v-card-title>
				<span class="text-h6">杯测</span>
				{{ cupping.location }}
				样本数量：{{ cupping.samplecount }} 评分次数：{{ cupping.scorecount }}
			</v-card-title>
			<v-card-text>
				<v-row>
					<template v-for="sample in samples">
						<v-col cols="12" sm="6" md="4">
							<v-card>
								<v-card-title>
									<span class="text-h6">{{ sample.bean.name }} / {{ sample.score }}分</span>
								</v-card-title>
								<v-card-subtitle class="d-flex flex-column">
									<span class="">{{ sample.beanqty }}g {{ sample.method }}</span>
									<span class="xtext-h6">水温：{{ sample.watertemp }}度</span>
									<span class="xtext-h6">萃取率{{ sample.extractionyield }}</span>
									<span class="xtext-h6">研磨度：{{ sample.grindsize }}</span>
								</v-card-subtitle>
								<v-card-actions>
									<v-btn color="primary" @click="sampleDetail(sample.id)">评分</v-btn>
									<v-btn @click="editSample(sample)">编辑</v-btn>
								</v-card-actions>
							</v-card>
						</v-col>
					</template>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
import { startsWith, trim } from 'lodash-es'
import qs from 'qs'

export default {
	components: {},
	props: [],
	data() {
		const qps = qs.parse(this.$route.query)
		return {
			id: qps.id,
			cupping: {},
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
		loadSamples(cupping_id) {
			this.$api.cupping.searchSample({ cupping_id }, (r) => {
				this.samples = r.objects
			})
		},
		sampleDetail(sample_id) {
			this.goTo(`/cupping/sample?id=${sample_id}`)
		},
		editSample(sample) {
			this.sampleId = sample.id
		}
	}
}
</script>
