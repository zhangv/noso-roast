<template>
	<v-container class="fill-height">
		<v-row justify="center" align="center" class="fill-height">
			<v-col cols="12" sm="8" md="6" lg="4">
				<v-card class="text-center" elevation="2">
					<v-card-text class="pa-8">
						<v-icon size="120" color="grey-lighten-1" class="mb-4">mdi-alert-circle-outline</v-icon>
						<h1 class="text-h3 font-weight-bold mb-4">404</h1>
						<h2 class="text-h5 mb-4">页面未找到</h2>
						<p class="text-body-1 mb-6 grey--text">抱歉，您访问的页面不存在或已被移除。</p>
						<v-btn color="primary" large @click="goHome" class="mr-4">
							<v-icon left>mdi-home</v-icon>
							返回首页
						</v-btn>
						<v-btn color="grey" variant="outlined" large @click="goBack">
							<v-icon left>mdi-arrow-left</v-icon>
							返回上页
						</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'NotFound',
	methods: {
		goHome() {
			this.$router.push('/')
		},
		goBack() {
			if (window.history.length > 1) {
				this.$router.go(-1)
			} else {
				this.$router.push('/')
			}
		}
	}
}
</script>

<style scoped>
.fill-height {
	height: 100vh;
}
</style>
