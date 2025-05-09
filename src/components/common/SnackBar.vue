<template>
	<v-snackbar v-model="showAlert" :timeout="alertObject.timeout" :color="alertObject.color">
		<div class="d-flex align-center justify-space-between" style="color: white; font-weight: bold">
			<span>{{ alertObject.message }}</span>
			<v-spacer />
			<v-icon @click="showAlert = false">$close</v-icon>
		</div>
	</v-snackbar>
</template>
<script>
import { useRootStore } from '@/stores/root'
import { mapWritableState, mapState } from 'pinia'

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
		...mapState(useRootStore, ['alertObject'])
	},
	watch: {},
	mounted() {},
	methods: {}
}
</script>
