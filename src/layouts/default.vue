<template>
	<AppHeader />
	<AppDrawer />
	<v-main>
		<router-view v-slot="{ Component, route }">
			<keep-alive :include="cachedPages">
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</v-main>
	<!-- <AppFooter /> -->
</template>

<script setup>
import AppDrawer from '../components/AppDrawer.vue'
import AppFooter from '../components/AppFooter.vue'
import AppHeader from '../components/AppHeader.vue'

const cachedPages = ['bean-manage']
</script>
