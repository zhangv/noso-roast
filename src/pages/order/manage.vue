<template>
  <div>
    <!-- <v-dialog v-model="formDlg"> -->
    <v-card>
      <v-card-title>编辑订单信息</v-card-title>
      <v-card-text>
        <order-form v-model:value="form" :errors="errors">
          <template #actions="{ object }">
            <v-card-actions>
              <v-btn color="primary" size="large" @click="save(object)">保存</v-btn>
            </v-card-actions>
          </template>
        </order-form>
      </v-card-text>
    </v-card>
    <!-- </v-dialog> -->

    <v-card-title class="d-flex align-center">
      订单管理
      <v-icon color="primary" dark @click="add">$plus</v-icon>
      <v-icon color="info" @click="load">$reload</v-icon>
      <v-spacer></v-spacer>
    </v-card-title>
    <OrderList ref="thelist" show-select :single-select="false" :init-query.sync="query">
      <template v-slot:batchActions="{ selected }"> </template>
      <template v-slot:actions="{ item }">
        <v-btn small @click="detail(item)">详情</v-btn>
        <template v-if="item.status == 'created'">
          <v-btn small @click="edit(item)">修改</v-btn>
          <v-btn small @click="confirmPay(item)">确认支付</v-btn>
        </template>
      </template>
    </OrderList>



  </div>
</template>

<script>
import qs from 'qs'
import { OrderForm, OrderList } from '@ui'
import { clone } from 'lodash-es';
import { format } from 'date-fns'
export default {
  components: { OrderForm, OrderList },
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
        { text: '#', value: 'id' },
        { text: '日期', align: 'left', sortable: true, value: 'date' },
        { text: '客户', value: 'user_id' },
        { text: '总金额', value: 'totalAmt' },
        { text: '实付金额', value: 'payAmt' },
        {
          text: '操作',
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
      this.$api2.order.update(form, (r) => {
        this.load()
        this.formDlg = false
      }, e => {
        this.errors = e.message
      })
    },
    edit(order) {
      console.log('edit', order)
      this.form = order
      this.formDlg = true
    },
    detail(order) {
      //TODO
    },
    confirmPay(item) {

    },
  }
}
</script>

<style scoped></style>
