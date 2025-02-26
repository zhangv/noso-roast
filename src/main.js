// Plugins
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
const pinia = createPinia()
import i18n from './plugins/i18n'
import router from '@/router'

// Components
import App from './App.vue'

import { createApp } from 'vue'

const app = createApp(App)
// registerPlugins(app)
app.use(vuetify)
app.use(pinia)
app.use(router)
app.use(i18n)
import api from './api'
app.config.globalProperties.$api = api
import http from './api/http'
app.config.globalProperties.$http = http

import soul from './soul'
app.config.globalProperties.$soul = soul

import registerStores from '@/stores'
const stores = registerStores()
app.config.globalProperties.$stores = stores

import { createI18n, useI18n } from 'vue-i18n'

// app.config.globalProperties.$t = i18n.global.t
app.config.globalProperties.$t = function (key, ...args) {
	const { t } = useI18n() // 让 Vue 访问 useI18n()
	return t(key, ...args)
}

import { useRootStore } from './stores/root'
import { format } from 'date-fns'
app.config.globalProperties.$confirm = function (
	title,
	config //{ message, buttonTrueText, buttonFalseText }
) {
	const store = useRootStore()
	return new Promise((resolve, reject) => {
		store.setConfirm({
			title,
			message: config ? config.message : null,
			confirmText: config ? config.buttonTrueText : null,
			cancelText: config ? config.buttonFalseText : null,
			resolve: resolve,
			reject: reject
		})
		store.setShowConfirm(true)
	}).finally(() => {
		store.setShowConfirm(false)
	})
}
app.config.globalProperties.goTo = function (path) {
	router.push(path)
}
app.config.globalProperties.$formatDate = function (long) {
	if (typeof long === 'string') {
		long = parseInt(long, 10)
	}
	const date = new Date(long * 1000)
	return format(date, 'yyyy-MM-dd')
}

import 'iconify-icon'
import { Icon } from '@iconify/vue'
app.component('Icon', Icon) //全局注册

app.mount('#app')
