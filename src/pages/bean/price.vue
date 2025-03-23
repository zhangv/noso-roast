<template>
  <v-sheet>
    <v-card-title class="d-flex align-center">
      熟豆价格表
      <v-icon color="primary" dark @click="add">$plus</v-icon>
      <v-icon color="info" @click="load">$reload</v-icon>

      <v-spacer></v-spacer>
      <v-btn @click="goTo(`/bean/pricelevel`)" text>价格等级</v-btn>
    </v-card-title>


  </v-sheet>
</template>

<script>
import qs from 'qs'

import { clone } from 'lodash-es';

export default {
  components: {},
  data() {

    const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
    return {
      beanid: qps.beanid,
      query: qps,

      prices: [],
    }
  },
  created() {
    this.load()
  },
  computed: {},
  watch: {},
  methods: {
    load() {
      this.$api2.roast.getBeanPriceList({ beanid: this.beanid }, r => {
        this.prices = r
      })
    },
    add() {
      this.form = {}
      this.formDlg = true
    },
    edit(item) {
      this.form = clone(item)
      this.formDlg = true
    },
    save(form) {
      form.status = 'valid'
      this.$api.roast.updateBean(form, (r) => {
        this.load()
      }, e => {
        this.errors = e.message
      })
    },

    del(item) {
      this.$confirm('确定要删除吗？').then((r) => {
        if (r === true) {
          let id = item.id
          this.$api.roast.remove(id, (data) => {
            const index = this.objects.findIndex((e) => e.ID === id)
            if (index >= 0) this.objects.splice(index, 1)
          })
        } else {
          alert(r)
        }
      })
    },
    stock(bean) {
      this.goTo(`/roast/beanstock/${bean.id}`)
    }
  }
}
</script>

<style scoped></style>
