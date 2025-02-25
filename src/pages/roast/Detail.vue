<template>
	<div>
		<template v-if="order.status === 'start'">

		</template>
	</div>
</template>
<script>
import { startsWith, trim } from 'lodash-es'

export default {
	components: {},
	props: ['id'],
	data() {
		return {
			order: {}
		}
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.$api.roast.getOrderById(`${this.id}/form`, (r) => {
				this.order = r
			})
		},
	}


}
</script>
