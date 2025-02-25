import * as Vue from 'vue'
import { localize, ValidationProvider } from 'vee-validate'
import en from 'vee-validate/dist/locale/en.json'
import zh_CN from 'vee-validate/dist/locale/zh_CN.json'

Vue.component('ValidationProvider', ValidationProvider)

localize({
    en,
    zh_CN
})
