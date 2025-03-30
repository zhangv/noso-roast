<template>

  <v-card-title class="d-flex align-center">
    生豆管理
    <v-icon color="primary" dark @click="add">$plus</v-icon>
    <v-icon color="info" @click="load">$reload</v-icon>
    <v-spacer></v-spacer>
  </v-card-title>
  <BeanList ref="thelist" show-select :single-select="false" :init-query.sync="query" :headers="headers">
    <template v-slot:batchActions="{ selected }"> </template>
    <template v-slot:actions="{ item }">
      <v-icon class="mr-2 mb-1" @click="edit(item)">$edit</v-icon>
      <v-icon class="mr-2 mb-1" @click="del(item)" color="error">$delete</v-icon>
      <v-btn class="mr-2 mb-1" small @click="stock(item)">批次查询</v-btn>
      <v-btn class="mr-2 mb-1" small @click="inStock(item)">入库</v-btn>
      <v-btn class="mr-2 mb-1" small @click="price(item)">价格</v-btn>
      <v-btn class="mr-2 mb-1" small @click="outStock(item)">出库</v-btn>
    </template>
  </BeanList>
  <v-dialog v-model="formDlg">
    <v-card>
      <v-card-title>编辑生豆信息</v-card-title>
      <v-card-text>
        <bean-form v-model:value="form" :errors="errors">
          <template #actions="{ object }">
            <v-btn color="primary" large @click="save(object)">保存</v-btn>
            <v-btn color="" large @click="formDlg = false">关闭</v-btn>
          </template>
        </bean-form>
      </v-card-text>

    </v-card>
  </v-dialog>
  <v-dialog v-model="batchDlg">
    <bean-batch-form v-model:value="batchForm" :errors="batchErrors">
      <template #actions="{ object }">
        <v-btn color="primary" large @click="saveBatch(object)">保存</v-btn>
        <v-btn color="" large @click="batchDlg = false">关闭</v-btn>
      </template>
    </bean-batch-form>

  </v-dialog>
  <v-dialog v-model="outDlg" max-width="80%">
    <BeanStockLogForm v-model:value="outForm" :errors="outErrors">
      <template #actions="{ object }">
        <v-btn color="primary" @click="saveStockLog(object)">保存</v-btn>
      </template>
    </BeanStockLogForm>
  </v-dialog>
</template>

<script>
import qs from 'qs'
import { BeanForm, BeanList, BeanBatchForm, BeanStockLogForm } from '@ui'
import { clone } from 'lodash-es';
import { format } from 'date-fns';

export default {
  components: { BeanForm, BeanList, BeanBatchForm, BeanStockLogForm },
  data() {
    const qps = qs.parse(location.search, { ignoreQueryPrefix: true })
    return {
      query: qps,
      refs: {},
      editingObj: {},
      objects: [],
      total: 0,
      showEditor: false,
      loading: false,
      options: {},
      formDlg: false,
      form: {},
      outDlg: false,
      outForm: {},
      outErrors: {},
      errors: {},
      headers: [
        { title: '#', value: 'id' },
        { title: '名称', align: 'left', sortable: true, value: 'name' },
        { title: '处理方式', sortable: true, value: 'process' },
        { title: '库存', sortable: true, value: 'rawStock' },
        { title: '状态', sortable: true, value: 'status' },
        {
          title: '操作',
          align: 'left',
          sortable: false,
          value: 'action'
        }
      ],
      batchForm: {},
      batchErrors: {},
      batchDlg: false
    }
  },
  mounted() {
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
      this.$api2.bean.update(form, (r) => {
        this.load()
        this.formDlg = false
      }, e => {
        this.errors = e.data
      })
    },
    inStock(bean) {
      this.batchForm = {
        bean_id: bean.id,
        date: format(new Date(), 'yyyy-MM-dd'),

      }
      this.batchDlg = true
    },
    outStock(bean) {
      this.outDlg = true
      this.outForm = {
        bean_id: bean.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'out'
      }
    },
    saveStockLog(log) {
      this.$api2.bean.updateStockLog(log, (r) => {
        this.load()
        this.outDlg = false
      }, e => {
        this.outErrors = e.message
      })

    },
    price(bean) {
      this.goTo(`/bean/price/?beanid=${bean.id}`)
    },
    saveBatch(form) {
      this.$api2.bean.updateBatch(form, (r) => {
        this.load()
        this.batchDlg = false
      }, e => {
        this.batchErrors = e.data
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
      this.goTo(`/bean/batchmanage/?beanid=${bean.id}`)
    }
  }
}
</script>

<style scoped></style>
