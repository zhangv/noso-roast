<template>
  <!-- 烘焙参数 -->
  <v-form>
    <v-card-text>
      <div class="d-flex flex-row align-center">
        <v-text-field v-model="form.date" :error-messages="errors.date" label="日期"></v-text-field>
      </div>
      <div class="d-flex flex-row align-center">
        <template v-if="selectedBean">
          {{ selectedBean.name }}
        </template>
        <bean-selector @selected="onBeanSelected">选择生豆</bean-selector>
        <v-alert type="error" v-if="!form.bean_id && errors.bean_id">{{ errors.bean_id }}</v-alert>
        <v-text-field type="number" v-model="form.totalQty" :error-messages="errors.totalQty" id="beanTemp"
          style="max-width: 10rem">
        </v-text-field>
        克
      </div>
      <div class="d-flex flex-row align-center">
        <v-radio-group label="类型" v-model="form.type" inline>
          <v-radio v-for="item in refs['TYPELABEL']" :key="item.value" :label="item.text" :error-messages="errors.type"
            :value="item.value"></v-radio>
        </v-radio-group>
      </div>
    </v-card-text>

    <slot name="actions" :object="form"></slot>
  </v-form>
</template>

<script>
import BeanSelector from './BeanSelector.vue'
import { clone } from 'lodash-es'
export default {
  components: {
    BeanSelector
  },
  props: {
    value: { type: Object, default: null },
    errors: { type: Object, default: () => ({}) }
  },
  mounted() {
    this.$api.common.getMeta('roast_BeanBatch', 'TYPELABEL,STATUSLABEL', res => {
      this.refs = res
    })
    if (this.value) {
      this.form = clone(this.value)
      if (this.form.bean_id)
        this.loadBean(this.form.bean_id)
    }
  },
  watch: {
    'form.bean_id'(v) {
      if (v) this.loadBean(v)
    },
    value(v) {
      if (v) this.form = clone(v)
    }
  },
  data() {
    return {
      form: {
        date: '',
        bean_id: null,
        totalQty: null,
        type: null
      },
      selectedBean: {},
      refs: {}
    }
  },
  computed: {

  },
  methods: {
    loadBean(id) {
      this.$http.get(`/roast/getBeanById/${id}`).then(res => {
        this.selectedBean = res
      })
    },
    onBeanSelected(beanids, beans) {
      this.form.bean_id = beanids[0]
      this.selectedBean = beans[0]
    },
  }
}
</script>
