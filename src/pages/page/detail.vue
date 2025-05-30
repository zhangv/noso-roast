<template>
	<div>
		{{ page.title }}
		{{ page.content }}
	</div>
</template>
<script>
export default {
	components: {},
	props: ['id'],
	data() {
		return {
			page: {}
		}
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.$api.page.getById(this.id, (r) => {
				this.page = r
			})
		}
	}
}
</script>
