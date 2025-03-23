<template>
  <v-app-bar :elevation="1">
    <!-- <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template> -->

    <v-app-bar-title>{{ $soul.title }}</v-app-bar-title>
    <v-spacer></v-spacer>
    <template v-if="isLoggedIn">
      <v-avatar :src="userInfo.avatar" :alt="userInfo.nickname" size="32" class="mr-2"
        @click="goTo({ name: 'user' })"></v-avatar>
      {{ userInfo.nickname }}
      <v-btn icon @click="loggingout()">
        <iconify-icon width="22" icon="solar:logout-line-duotone"></iconify-icon>
      </v-btn>

    </template>
    <template v-else>
      <v-btn icon @click="setShowLogin(true)">
        <iconify-icon width="22" icon="solar:login-line-duotone"></iconify-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { useRootStore } from '@/stores/root';
import { useVisitorStore } from '@/stores/visitor';
import { mapActions, mapState } from 'pinia';

export default {
  components: {},
  props: {},
  mounted() {

  },
  computed: {
    ...mapState(useRootStore, ['showLogin']),
    ...mapState(useVisitorStore, ['userInfo', 'isLoggedIn'])
  },

  watch: {},

  created() { },
  methods: {
    ...mapActions(useRootStore, ['setShowLogin']),
    ...mapActions(useVisitorStore, ['logout']),
    loggingout() {
      this.$confirm(
        this.$t('common.confirm_to', [this.$t('login.logout')]),
      ).then((r) => {
        if (r) {
          this.logout()
        }
      })
    },
    goTo(to) {
      this.$router.push(to)
    }
  }
}
</script>


<style scoped lang="sass"></style>
