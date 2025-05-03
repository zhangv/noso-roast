// Plugins
// Components
import App from './App.vue'
import api from './api'
import http from './api/http'
import debounce from './plugins/debounce'
import i18n from './plugins/i18n'
import vuetify from './plugins/vuetify'
import soul from './soul'
import { useRootStore } from './stores/root'
import router from '@/router'
import registerStores from '@/stores'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import 'iconify-icon'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const pinia = createPinia()

const app = createApp(App)
// registerPlugins(app)
app.use(vuetify)
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(debounce)

app.config.globalProperties.$api = api

app.config.globalProperties.$http = http

app.config.globalProperties.$soul = soul

const stores = registerStores()
app.config.globalProperties.$stores = stores

app.config.globalProperties.$confirm = async function (
	title,
	config //{ message, buttonTrueText, buttonFalseText }
) {
	const store = useRootStore()
	try {
		return await new Promise((resolve, reject) => {
			store.setConfirm({
				title,
				message: config ? config.message : null,
				confirmText: config ? config.buttonTrueText : null,
				cancelText: config ? config.buttonFalseText : null,
				resolve: resolve,
				reject: reject
			})
			store.setShowConfirm(true)
		})
	} finally {
		store.setShowConfirm(false)
	}
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

app.component('Icon', Icon) //全局注册
app.component('iconify-icon', Icon) //全局注册
app.mount('#app')
