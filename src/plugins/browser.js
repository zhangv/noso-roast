import * as Vue from 'vue'
import Browser from 'bowser'
const browser = Browser.parse(window.navigator.userAgent)
Vue.prototype.$browser = browser
