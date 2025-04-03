<template>
  <v-app>
    <login-dialog />
    <snack-bar position="fixed" rounded class="safe-fixed-top d-flex justify-space-between" />
    <div class="overflow-y-auto mt-0 mx-0" id="main" style="height: 100vh">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="Component" />
        <div v-else>Loading...</div>
      </router-view>
    </div>
    <confirm-dialog v-model="showConfirm" :confirm="confirm" />
  </v-app>
</template>

<script>
import LoginDialog from '@/components/user/LoginDialog.vue'
import SnackBar from '@/components/common/SnackBar.vue'
import { ConfirmDialog } from '@ui'
import { mapWritableState } from 'pinia';
import { useRootStore } from './stores/root';
export default {
  components: {
    LoginDialog,
    SnackBar, ConfirmDialog
  },
  computed: {
    ...mapWritableState(useRootStore, ['confirm', 'showConfirm']),
  },
  mounted() {
    window.document.title = this.$soul.title
  }
}
</script>
