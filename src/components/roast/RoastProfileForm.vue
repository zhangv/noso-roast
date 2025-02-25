<template>
  <!-- 烘焙参数 -->
  <v-form @submit.prevent="submitForm">
    <div class="d-flex flex-row align-center">
      <label for="startTemp">入豆温:</label>
      <v-text-field type="number" v-model="form.startTemp" id="startTemp" style="max-width: 10rem"
        append-icon="mdi-temperature-celsius"></v-text-field>
    </div>
    <div class="d-flex flex-row align-center">
      <v-text-field type="number" label="转黄时间" v-model="form.yellowTime" id="yellowTime"
        style="max-width: 10rem"></v-text-field>秒

      <v-text-field class="ml-4" type="number" label="转黄温度" v-model="form.yellowTemp" id="yellowTemp"
        style="max-width: 10rem" append-icon="mdi-temperature-celsius"></v-text-field>
    </div>
    <div class="d-flex flex-row align-center">
      <v-text-field type="number" label="一爆时间" v-model="form.fcTime" id="yellowTime"
        style="max-width: 10rem"></v-text-field>秒
      <v-text-field class="ml-4" type="number" label="一爆温度" v-model="form.fcTemp" id="yellowTemp"
        style="max-width: 10rem" append-icon="mdi-temperature-celsius"></v-text-field>
    </div>
    <div class="d-flex flex-row align-center">
      <v-text-field type="number" label="二爆时间" v-model="form.scTime" style="max-width: 10rem"></v-text-field>秒
      <v-text-field class="ml-4" type="number" label="二爆温度" v-model="form.scTemp" id="yellowTemp"
        style="max-width: 10rem" append-icon="mdi-temperature-celsius"></v-text-field>
    </div>
    <div class="d-flex flex-row align-center">
      <v-text-field type="number" label="总时间" v-model="form.totalTime" style="max-width: 10rem"></v-text-field>秒
      <template v-if="form.totalTime && form.fcTime">
        DTR：
        {{ dtr }}%
      </template>
    </div>

    <slot name="actions" :form="form"></slot>
  </v-form>
</template>

<script>
export default {
  props: {
    value: { type: Object, default: null }
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
      }
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
    dtrTime(newVal) {
      this.calculateDtrPercentage();
    },
    firstCrackTime(newVal) {
      this.calculateDtrPercentage();
    }
  },
  methods: {
    calculateDtrPercentage() {
      if (this.form.firstCrackTime && this.form.dtrTime) {
        this.form.dtrPercentage = ((this.form.dtrTime / this.form.firstCrackTime) * 100).toFixed(2);
      }
    },
    submitForm() {
      this.$emit('submit', this.form);
    }
  }
}
</script>
