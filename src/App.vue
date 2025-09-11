<template>
	<v-app style="min-width: 370px !important">
		<login-dialog />
		<snack-bar position="fixed" location="top" rounded class="safe-fixed-top d-flex justify-space-between" />
		<router-view />
		<confirm-dialog v-model:value="showConfirm" :confirm="confirm" />
	</v-app>
</template>

<script>
import AppDrawer from './components/AppDrawer.vue'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import { useRootStore } from './stores/root'
import SnackBar from '@/components/common/SnackBar.vue'
import LoginDialog from '@/components/user/LoginDialog.vue'
import { ConfirmDialog } from '@ui'
import { mapWritableState } from 'pinia'

export default {
	components: {
		LoginDialog,
		SnackBar,
		ConfirmDialog,
		AppHeader,
		AppDrawer,
		AppFooter
	},
	computed: {
		...mapWritableState(useRootStore, ['confirm', 'showConfirm'])
	},
	mounted() {
		window.document.title = this.$soul.title
	}
}
</script>
