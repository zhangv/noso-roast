<template>
  <v-card-title class="d-flex align-center">
    价格等级维护
    <v-icon color="primary" dark @click="add">$plus</v-icon>
    <v-icon color="info" @click="load">$reload</v-icon>
    <v-spacer></v-spacer>
  </v-card-title>
  <v-card-text>
    <PriceLevelList ref="thelist" show-select :single-select="false" :init-query.sync="query" :headers="headers">
      <template v-slot:batchActions="{ selected }"> </template>
      <template v-slot:actions="{ item }">
        <v-icon class="mr-2 mb-1" @click="edit(item)">$edit</v-icon>
        <v-icon class="mr-2 mb-1" @click="del(item)" color="error">$delete</v-icon>
      </template>
    </PriceLevelList>
  </v-card-text>
  <v-dialog v-model="formDlg">
    <price-level-form v-model:value="form" :errors="errors">
      <template #actions="{ object }">
        <v-btn color="primary" large @click="save(object)">保存</v-btn>
        <v-btn color="" large @click="formDlg = false">关闭</v-btn>
      </template>
    </price-level-form>
  </v-dialog>
</template>

<script>
import qs from 'qs'
import { clone } from 'lodash-es';
import { PriceLevelForm, PriceLevelList } from '@ui'
export default {
  components: {
    PriceLevelForm,
    PriceLevelList
  },
  data() {
    const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
    return {
      query: qps,
      results: [],
      form: {},
      formDlg: false,
      errors: {}
    }
  },
  created() {
  },
  computed: {},
  watch: {},
  methods: {
    load() {
      this.$refs.thelist.load()
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
      this.$api2.bean.updatePriceLevel(form, (r) => {
        this.load()
        this.formDlg = false
      }, e => {
        this.errors = e.data
      })
    },

    del(item) {
      this.$confirm('确定要删除吗？').then((r) => {
        if (r === true) {
          let id = item.id
          this.$api.bean.removePriceLevel(id, (data) => {
            const index = this.objects.findIndex((e) => e.ID === id)
            if (index >= 0) this.objects.splice(index, 1)
          })
        } else {
          alert(r)
        }
      })
    },
  }
}
</script>

<style scoped></style>
