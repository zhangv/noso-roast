<template>
  <!-- 烘焙参数 -->
  <v-form>
    <v-card-title>开始烘焙</v-card-title>
    <v-card-text>
      <div class="d-flex flex-row align-center">
        <v-text-field v-model="form.name" :error-messages="errors.name"
          label="烘焙ID（默认格式为 BeanProfileName + Y-m-d + #N)"></v-text-field>
      </div>
      <div class="d-flex flex-row flex-wrap align-center">
        <div>
          <bean-selector @selected="onBeanSelected">选择生豆</bean-selector>
          <v-alert type="warning" dense v-if="!form.bean_id && errors.bean_id">{{ errors.bean_id }}</v-alert>
        </div>

        <v-chip color=warning>合计{{ totalQty }} 克</v-chip>
        <template v-if="selectableBatches && selectableBatches.length > 0">
          <v-select v-model="selectedBatchId" :items="selectableBatches" item-title="date" item-value="id"
            label="选择批次"></v-select>
        </template>

        <template v-if="form.bean_id && selectedBatch">
          <v-text-field type="number" v-model="selectedBatchQty" id="beanTemp" style="max-width: 10rem">
          </v-text-field>
          克/ {{ selectedBatch.currentqty }} 克
          <v-btn @click="addBatch" v-if="selectedBatch.id && selectedBatchQty > 0">添加</v-btn>
        </template>
      </div>
      <template v-show="form.bean_id">
        <v-table v-if="form.batches && form.batches.length > 0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">名称</th>
                <th class="text-left">批次</th>
                <th class="text-left">数量</th>
                <th class="text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(batch, i) in form.batches" :key="i">
                <td>{{ batch.id }}</td>
                <td>{{ batch.date }} {{ batch.seq }}</td>
                <td>{{ batch.qty }} 克</td>
                <td>
                  <v-btn @click="form.batches.splice(i, 1)" text color="error"><v-icon>$delete</v-icon></v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>

      </template>


    </v-card-text>

    <slot name="actions" :object="form"></slot>
  </v-form>
</template>

<script>
import BeanSelector from '@/components/bean/BeanSelector.vue'
export default {
  components: {
    BeanSelector
  },
  props: {
    value: { type: Object, default: null },
    errors: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      form: {
        startTemp: '',
        yellowTemp: '',
        yellowTime: '',
        fcTemp: '',
        fcTime: '',
        scTemp: '',
        scTime: '',
        totalTime: null,
        batches: [],
      },
      selectedBean: {},
      selectableBatches: [],
      selectedBatchId: null,
      selectedBatchQty: null
    }
  },
  computed: {
    dtr() {
      if (this.form.totalTime && this.form.fcTime) {
        return (((this.form.totalTime - this.form.fcTime) / this.form.totalTime) * 100).toFixed(2)
      }
    },
    totalQty() {
      return this.form.batches.reduce((acc, cur) => acc + cur.qty, 0)
    },
    selectedBatch() {
      return this.selectableBatches.find(e => e.id == this.selectedBatchId)
    }
  },
  watch: {
    form: {
      handler(val) {
        this.form.name = this.generatedName()
      },
      deep: true
    }
  },
  methods: {
    generatedName() {
      let name = new Date().toISOString().slice(0, 10)
      if (this.selectedBean && this.selectedBean.name) {
        name += `${this.selectedBean.name}`
      }
      if (this.totalQty) {
        name += `${this.totalQty}g`
      }
      return name
    },
    onBeanSelected(beanids, beans) {
      this.form.bean_id = beanids[0]
      this.selectedBean = beans[0]
      this.form.batches = [] //选择其他豆时需要清空批次信息
      this.selectedBatch = {}
      this.selectableBatches = []
      let params = {
        bean_id: this.form.bean_id,
        currentQty: " > 0"
      }
      this.$http.get(`/roast/searchBeanBatch`, { params }).then(res => {
        if (res.total > 0) {
          this.selectableBatches = res.objects
          if (this.selectableBatches.length == 1)
            this.selectedBatch = this.selectableBatches[0]
        } else {
          alert('没有可用的批次，请先添加批次')
        }
      })
    },
    addBatch() {
      let ex = this.form.batches.find(e => e.id == this.selectedBatch.id)
      console.log(ex)
      if (ex) {
        ex.qty += parseInt(this.selectedBatchQty)
      } else
        this.form.batches.push({
          id: this.selectedBatch.id,
          qty: parseInt(this.selectedBatchQty),
          date: this.selectedBatch.date,	//批次日期
          seq: this.selectedBatch.seq		//批次序号
        })
      this.form.inQty = this.totalQty
      this.selectedBatch = {}
      this.selectedBatchQty = null
    }
  }
}
</script>
