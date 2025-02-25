<template>
  <!-- 生豆信息 -->
  <div class="d-flex flex-row align-center">
    <v-text-field label="名称" v-model="form.name" style="max-width:20rem" :error-messages="errors.name"></v-text-field>
    <v-text-field label="编码" v-model="form.code" style="max-width:20rem" :error-messages="errors.code"></v-text-field>
  </div>
  <div class="d-flex flex-row align-center">
    类型：
    <v-radio-group v-model="form.type" row>
      <v-radio v-for="item in types" :key="item.value" :label="item.text" :error-messages="errors.type"
        :value="item.value"></v-radio>
    </v-radio-group>

    <v-text-field label="豆种" v-model="form.variety" style="max-width:20rem"
      :error-messages="errors.variety"></v-text-field>
  </div>
  <div class="d-flex flex-row align-center">
    处理方式：
    <v-radio-group v-model="form.process" row>
      <v-radio v-for="item in refs['PROCESSLABEL']" :key="item.value" :label="item.text"
        :error-messages="errors.process" :value="item.value"></v-radio>
    </v-radio-group>
  </div>
  <div class="d-flex flex-row align-center">

    <v-select label="国家" v-model="form.country" :items="countries" :item-title="'text'" style="max-width:10rem"
      :error-messages="errors.country"></v-select>

    <v-text-field label="庄园/处理站" v-model="form.processor" :error-messages="errors.processor"></v-text-field>
  </div>
  <div class="d-flex flex-row align-center">

    <v-text-field label="供应商/贸易商" v-model="form.provider" :error-messages="errors.provider"></v-text-field>
  </div>
  <!-- <v-card class=mb-2>
			<v-card-title>生豆状态（入库时）</v-card-title>
			<v-card-text class="d-flex flex-row align-center">
				<label for="beanWeight">密度:</label>
				<v-text-field v-model="form.density" :error-messages="errors.density"></v-text-field>

				<label for="beanWeight">含水率:</label>
				<v-text-field v-model="form.moisture" :error-messages="errors.moisture"></v-text-field>
			</v-card-text>
		</v-card> -->
  <slot name="actions" :object="form"></slot>

</template>

<script>
import { clone } from 'lodash-es';
export default {
  props: {
    value: Object,
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: 'test'
      },
      refs: {},
      types: [
        { text: '拼配', value: 'blend' },
        { text: '单品', value: 'single' },
      ],
      processOptions: [
        { text: '日晒', value: 'natural' },
        { text: '水洗', value: 'washed' },
        { text: '蜜处理', value: 'honey' },
        { text: '其他', value: 'other' }
      ],
      countries: [
        { text: '埃塞俄比亚', value: 'ethiopia' },
        { text: '越南', value: 'vietnam' },
        { text: '哥伦比亚', value: 'colombia' },
        { text: '巴西', value: 'brazil' },
        { text: '印度尼西亚', value: 'indonesia' },
        { text: '洪都拉斯', value: 'honduras' },
        { text: '印度', value: 'india' },
        { text: '乌干达', value: 'uganda' },
        { text: '墨西哥', value: 'mexico' },
        { text: '秘鲁', value: 'peru' },
        { text: '危地马拉', value: 'guatemala' },
        { text: '哥斯达黎加', value: 'costa_rica' },
        { text: '尼加拉瓜', value: 'nicaragua' },
        { text: '埃尔萨尔瓦多', value: 'el_salvador' },
        { text: '坦桑尼亚', value: 'tanzania' },
        { text: '肯尼亚', value: 'kenya' },
        { text: '巴布亚新几内亚', value: 'papua_new_guinea' },
        { text: '委内瑞拉', value: 'venezuela' },
        { text: '多米尼加共和国', value: 'dominican_republic' },
        { text: '马达加斯加', value: 'madagascar' },
        { text: '其他', value: 'other' }
      ]
    }
  },
  mounted() {
    console.log(this.value)
    this.form = clone(this.value);
    this.$api.common.getMeta('roast_Bean', 'TYPELABEL,PROCESSLABEL', res => {
      this.refs = res;
    })
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.form = clone(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.form);
    }
  }
}
</script>
