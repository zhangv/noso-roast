<template>
	<div>
		<v-card-title class="d-flex align-center">
			账户历史
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-card-text>
			<ShopAccountLogTable
				ref="thelist"
				:init-query="query"
				:key="query.toString()"
				show-select
				:single-select="false"
			>
				<template v-slot:batchActions="{ selected }"></template>
				<template v-slot:actions="{ item }">
					<v-btn small @click="view(item)">查看</v-btn>
				</template>
			</ShopAccountLogTable>
		</v-card-text>
	</div>
</template>

<script>
import { ShopAccountLogTable } from '@ui'
import qs from 'qs'

export default {
	components: { ShopAccountLogTable },
	props: [],
	data() {
		const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
		return {
			query: qps,
			refs: {},
			editingObj: {},
			objects: [],
			total: 0,
			loading: false,
			options: {}
		}
	},
	mounted() {
		this.load()
	},
	// activated() {
	// 	this.query = qs.parse(location.search, { ignoreQueryPrefix: true })
	// },
	computed: {},
	watch: {
		// query: {
		// 	handler(nv, ov) {
		// 		console.log('query', nv, ov)
		// 		this.load()
		// 	},
		// 	deep: true
		// }
	},
	methods: {
		load() {
			this.$refs.thelist.load()
		},
		view(item) {}
	}
}
</script>

<style scoped></style>
