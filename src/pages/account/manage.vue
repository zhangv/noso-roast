<template>
  <div>
    <v-card-title class="d-flex align-center">
      账户管理
      <v-icon color="primary" dark @click="add">$plus</v-icon>
      <v-icon color="info" @click="load">$reload</v-icon>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <ShopAccountTable ref="thelist" :headers="headers" show-select :single-select="false" :init-query.sync="query">
        <template v-slot:batchActions="{ selected }"> </template>
        <template v-slot:actions="{ item }">
          <v-btn small @click="edit(item)">修改</v-btn>
        </template>
      </ShopAccountTable>

    </v-card-text>
    <v-dialog v-model="formDlg">
      <account-form v-model:value="form" :errors="errors">
        <template #actions="{ object }">
          <v-btn color=primary @click="save(object)">保存</v-btn>
        </template>
      </account-form>
    </v-dialog>

  </div>
</template>

<script>
import qs from 'qs'
import { ShopAccountForm, ShopAccountTable } from '@ui'
import { clone } from 'lodash-es';
import { format } from 'date-fns'
export default {
  components: { AccountForm: ShopAccountForm, ShopAccountTable },
  props: [],
  data() {
    const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
    return {
      query: qps,
      refs: {},
      editingObj: {},
      objects: [],
      total: 0,
      loading: false,
      options: {},
      formDlg: false,
      form: {},
      errors: {},
      headers: [
        { title: '#', value: 'id' },
        { title: '账户名', value: 'name' },
        { title: '类型', value: 'type' },
        { title: '余额', value: 'balance' },
        {
          title: '操作',
          align: 'left',
          sortable: false,
          value: 'action'
        }
      ],
    }
  },
  mounted() {
    this.load()
  },
  computed: {},
  watch: {},
  methods: {
    load() {
      this.$refs.thelist.load()
    },
    add() {
      this.form = {
        date: format(new Date(), 'yyyy-MM-dd'),

      }
      this.formDlg = true
    },

    save(form) {
      this.$api2.shop.updateAccount(form, (r) => {
        this.load()
        this.formDlg = false
      }, e => {
        this.errors = e.message
      })
    },
    edit(batch) {
      this.form = clone(batch)
      this.formDlg = true
    },
  }
}
</script>

<style scoped></style>
