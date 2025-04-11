<template>
	<div>
		<v-card-title class="d-flex align-center">
			账户历史
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-card-text>
			<ShopAccountLogTable ref="thelist" show-select :single-select="false">
				<template v-slot:batchActions="{ selected }"></template>
				<template v-slot:actions="{ item }">
					<v-btn small @click="view(item)">查看</v-btn>
				</template>
			</ShopAccountLogTable>
		</v-card-text>
		<v-dialog v-model="formDlg">
			<account-form v-model:value="form" :errors="errors">
				<template #actions="{ object }">
					<v-btn color="primary" @click="save(object)">保存</v-btn>
				</template>
			</account-form>
		</v-dialog>
	</div>
</template>

<script>
import { ShopAccountLogTable } from '@ui'
import { format } from 'date-fns'
import { clone } from 'lodash-es'
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
			options: {},
			formDlg: false,
			form: {},
			errors: {}
		}
	},
	mounted() {
		this.load()
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			this.$refs.thelist.load()
		},
		view(item) {}
	}
}
</script>

<style scoped></style>
