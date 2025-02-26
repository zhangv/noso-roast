<template>
  <v-navigation-drawer :rail="rail" permanent width="120" rail-width="70">
    <v-list-item title="" class="d-flex justify-center" subtitle="" @click="rail = !rail">
      <v-icon v-if="rail">$right</v-icon>
      <v-icon v-else>$left</v-icon>
    </v-list-item>
    <!-- <v-divider></v-divider> -->
    <v-list-item v-for="item in items" link @click="$router.push(item.to)" class="text-center">
      <!-- <v-icon :icon="item.icon"></v-icon> -->
      <Icon :icon="item.icon" :style="{ color: item.color || 'inherit' }" width="1.4rem" />
      {{ item.title }}
    </v-list-item>
  </v-navigation-drawer>
</template>

<script>

export default {
  components: {},
  props: {},
  mounted() {

  },
  data() {
    const menu = this.$soul.menu
    return {
      items: menu,
      rail: true
    }
  },

  computed: {},

  watch: {},

  created() { },

  methods: {
    goTo(to) {
      this.$router.push(to)
    }
  }
}
</script>

<style scoped lang="sass"></style>
