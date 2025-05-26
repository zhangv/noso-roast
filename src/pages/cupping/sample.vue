<template>
	<div>
		<v-card-title>
			样本详情
			<span class="text-h6">{{ scoreSummary.count }}次评分 总平均分 {{ scoreSummary.total }}</span>
			<v-btn color="primary" @click="scoreDlg = true">评分</v-btn>
			<a :href="`/cupping/detail?id=${sample.cupping_id}`">杯测</a>
		</v-card-title>
		<v-card-subtitle>
			<v-row>
				<v-col cols="6">
					<v-chart
						v-if="scoreSummary"
						:option="getRadarData(scoreSummary)"
						autoresize
						style="height: 300px"
					/>
				</v-col>
				<v-col cols="6" class="d-flex flex-column justify-center">
					<span class="text-h6">豆子：{{ sample.bean?.name }}</span>
					<span class="text-h6">备注：{{ sample.memo }}</span>
					<span class="text-h6">豆量：{{ sample.beanqty }}g</span>
					<span class="text-h6">杯测方法：{{ sample.method }}</span>
					<span class="text-h6">水温：{{ sample.watertemp }}度</span>
					<span class="text-h6">萃取率{{ sample.extractionyield }}</span>
					<span class="text-h6">研磨度：{{ sample.grindsize }}</span>
				</v-col>
			</v-row>
		</v-card-subtitle>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<v-card
						v-for="score in scores"
						:key="score.id"
						class="d-inline-block mr-2"
						style="max-width: 300px"
					>
						<v-card-title></v-card-title>
						<v-card-subtitle>
							{{ score.created_at }}
							<span v-if="score.user_id && score.user">用户：{{ score.user.nickname }}</span>
							{{ score.notes }}
						</v-card-subtitle>
						<v-card-text>
							<v-chart :option="getRadarData(score)" autoresize style="height: 300px" />
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</div>
	<v-dialog v-model="scoreDlg">
		<CuppingScoreForm :sample="sample">
			<template #actions="{ object }">
				<v-btn color="primary" @click="submitScore(object)">提交评分</v-btn>
			</template>
		</CuppingScoreForm>
	</v-dialog>
</template>
<script>
import { CuppingScoreForm } from '@ui'
import { RadarChart } from 'echarts/charts'
import { PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import qs from 'qs'
import VChart, { THEME_KEY } from 'vue-echarts'

use([CanvasRenderer, RadarChart, PolarComponent, TitleComponent, TooltipComponent])
provide(THEME_KEY, 'dark')

export default {
	name: 'CuppingSample',
	components: {
		CuppingScoreForm,
		VChart
	},

	props: [],
	data() {
		const qps = qs.parse(this.$route.query)
		return {
			sampleId: qps.id,
			sample: {},
			scores: [],
			total: 0,
			dimensions: [
				{ name: '香气', field: 'fragrance', max: 10 },
				{ name: '风味', field: 'flavor', max: 10 },
				{ name: '酸度', field: 'acidity', max: 10 },
				{ name: '醇厚', field: 'body', max: 10 },
				{ name: '平衡', field: 'balance', max: 10 },
				{ name: '余韵', field: 'aftertaste', max: 10 },
				{ name: '甜度', field: 'sweetness', max: 10 },
				{ name: '干净', field: 'cleancup', max: 10 },
				{ name: '一致性', field: 'uniformity', max: 10 },
				{ name: '整体', field: 'overall', max: 10 }
			],
			chartOptions: {},
			scoreSummary: {},
			scoreDlg: false
		}
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.$api.cupping.getSampleById(`${this.sampleId}`, (r) => {
				this.sample = r
				this.loadScores(this.sample.id)
			})
		},
		getSampleScoreSummary(sample_id) {
			this.$api.cupping.getSampleScoreSummary(`${sample_id}`, (r) => {
				this.scoreSummary = r
			})
		},
		loadScores(sample_id) {
			this.$api.cupping.searchScore({ sample_id }, (r) => {
				this.scores = r.objects
				this.total = r.total
				this.getSampleScoreSummary(this.sample.id)
			})
		},

		getRadarData(score) {
			const values = this.dimensions.map(({ field }) => score[field])
			const total = values.reduce((acc, curr) => acc + curr, 0)
			return {
				title: {
					text: '总分：' + total,
					top: '5%',
					left: '5%'
				},
				textStyle: {
					fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
					fontWeight: 300
				},
				radar: {
					indicator: this.dimensions.map(({ name, max }) => ({ name, max }))
				},
				series: [
					{
						name: 'Value',
						type: 'radar',
						data: [
							{
								value: values
							}
						]
					}
				]
			}
		},
		submitScore(object) {
			let form = {
				...object,
				cuppingsample_id: this.sample.id,
				cupping_id: this.sample.cupping_id,
				bean_id: this.sample.bean_id
			}
			this.$api.cupping.updateScore(form, (r) => {
				this.loadScores(this.sample.id)
				this.scoreDlg = false
			})
		}
	}
}
</script>
