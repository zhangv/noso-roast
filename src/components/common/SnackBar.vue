<template>
	<v-snackbar v-model="show" :timeout="alert.timeout" :color="alert.color">
		<div
			class="d-flex align-center justify-space-between"
			style="color: white; font-weight: bold"
		>
			<span>{{ alert.message }}</span>
			<v-spacer />
			<v-icon @click="showAlert = false">$close</v-icon>
		</div>
	</v-snackbar>
</template>
<script>
import { mapWritableState, mapState } from 'pinia'
import { useRootStore } from '@/stores/root'
export default {
	props: {
		multiLine: { type: Boolean, default: false }
	},
	data() {
		return {
			show: false
		}
	},
	computed: {
		...mapWritableState(useRootStore, ['showAlert']),
		...mapState(useRootStore, ['alert'])
	},
	watch: {},
	mounted() {},
	methods: {}
}
</script>
