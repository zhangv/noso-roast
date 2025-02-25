<template>
  <v-app>
    <AppHeader />

    <AppDrawer />

    <v-main>
      <router-view />
    </v-main>

    <!-- <AppFooter /> -->

  </v-app>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppDrawer from '../components/AppDrawer.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
