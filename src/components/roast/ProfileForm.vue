<template>
  <!-- 烘焙参数 -->
  <v-form>
    <v-card-title>修改烘焙</v-card-title>
    <v-card-text>
      <div class="d-flex flex-row align-center">
        <v-text-field v-model="form.name" :error-messages="errors.name" readonly
          label="烘焙ID（默认格式为 BeanProfileName + Y-m-d + #N)"></v-text-field>
      </div>
      <div class="d-flex flex-row align-center">
        {{ bean.name }}
        <span style="color:green">{{ form.inqty }}</span>
        =>
        <span v-if="form.outqty" style="color:brown;font-weight:bolder">
          {{ form.outqty }}</span>克
      </div>
      <div class="d-flex flex-row align-center">
        <label for="startTemp">入豆温:</label>
        <v-text-field type="number" v-model="form.startTemp" id="startTemp" style="max-width: 10rem"
          append-icon="mdi-temperature-celsius"></v-text-field>
      </div>
      <div class="d-flex flex-row align-center">
        <v-text-field type="number" label="转黄时间" v-model="form.yellowTime" style="max-width: 10rem"></v-text-field>秒

        <v-text-field class="ml-4" type="number" label="转黄温度" v-model="form.yellowTemp" style="max-width: 10rem"
          append-icon="mdi-temperature-celsius"></v-text-field>
      </div>
      <div class="d-flex flex-row align-center">
        <v-text-field type="number" label="一爆时间" v-model="form.fcTime" style="max-width: 10rem"></v-text-field>秒
        <v-text-field class="ml-4" type="number" label="一爆温度" v-model="form.fcTemp" style="max-width: 10rem"
          append-icon="mdi-temperature-celsius"></v-text-field>
      </div>
      <div class="d-flex flex-row align-center">
        <v-text-field type="number" label="二爆时间" v-model="form.scTime" style="max-width: 10rem"></v-text-field>秒
        <v-text-field class="ml-4" type="number" label="二爆温度" v-model="form.scTemp" style="max-width: 10rem"
          append-icon="mdi-temperature-celsius"></v-text-field>
      </div>
      <div class="d-flex flex-row align-center">
        <v-text-field type="number" label="总时间" v-model="form.totalTime" style="max-width: 10rem"></v-text-field>秒
        <template v-if="form.totalTime && form.fcTime">
          DTR：
          {{ dtr }}%
        </template>
      </div>
    </v-card-text>

    <slot name="actions" :object="form"></slot>
  </v-form>
</template>

<script>
import { value, clone } from 'lodash-es';
import BeanSelector from '@/components/bean/BeanSelector.vue'
export default {
  components: {
    BeanSelector
  },
  props: {
    value: { type: Object, default: () => ({}) },
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
        totalTime: null
      },
      profile: {},
      bean: {}
    }
  },
  computed: {
    dtr() {
      if (this.form.totalTime && this.form.fcTime) {
        return (((this.form.totalTime - this.form.fcTime) / this.form.totalTime) * 100).toFixed(2)
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.form = clone(val)
          this.loadProfile()
        }
      },
      immediate: true
    },

  },
  methods: {
    loadProfile() {
      if (this.form && this.form.id) {
        this.$http.get(`/roast/getProfileByRoastId/${this.form.id}`).then(res => {
          this.form = res
        })
      } else this.form = {}
    },
    loadBean() {
      if (this.form && this.form.bean_id) {
        this.$http.get(`/roast/getBeanById/${this.form.bean_id}`).then(res => {
          this.bean = res
        })
      }
    }
  }
}
</script>
