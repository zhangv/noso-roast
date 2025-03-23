import { defineStore } from 'pinia'
import {
	loadTrackId,
	saveTrackId,
	loadBackgroundMusic,
	saveBackgroundMusic,
	loadLocale,
	saveLocale,
	initDeviceInfo
} from '../utils/cache'
import packageJson from '../../package.json'
import browser from '@/utils/browser'
import API from '@/api/'
import version from '../../public/version.json'
import i18n from '@/plugins/i18n'

import soul from '../soul'
import Utils from '@/utils/utils'

export const useRootStore = defineStore('root', {
	state: () => {
		return {
			showLogin: false,
			accessToken: null,
			activeTab: null,
			loading: false,
			showDrawer: false,
			// isWechat: Utils.isWechat(), 可能是bundle的原因，Utils会未初始化
			showAlert: false,
			alert: {
				message: null,
				timeout: 5000,
				color: null
			},
			landingUrl: null,
			theme: 'light',
			settings: {},
			appVersion: packageJson.version,
			secret: version.secret,
			platform: version.platform,
			device: initDeviceInfo(), //这里初始化cordova还没好，要放到deviceReady
			backgroundMusicPlaying: loadBackgroundMusic(),
			wxConfig: false, //only working in iOS + wechat browser
			locales: soul.locales,
			locale: loadLocale(),
			showShare: false,
			shareInfo: {},
			isWechat: Utils.isWechat(),
			showConfirm: false,
			confirm: {} // {title,message,confirmText,cancelText,confirmCallback,cancelCallback}
		}
	},
	getters: {},
	actions: {
		setShowConfirm(show) {
			this.showConfirm = show
		},
		setConfirm(confirm) {
			this.confirm = confirm
		},
		setTrackId() {
			var c = loadTrackId()
			if (!c) {
				saveTrackId()
			}
		},
		getTrackId() {
			return loadTrackId()
		},
		getSettings(names) {
			if (!this.settings || Object.keys(this.settings).length === 0) {
				API.common.getSettings(names, (res) => {
					this.settings = res
				})
			}
		},
		wxConfig() {
			if (Utils.isWechat()) {
				if (Utils.isWechatApp()) {
				} else {
					let url = window.location.href.split('?')[0]
					if (browser.versions.ios) {
						//ios必须用landingpage - 2019-12-30 - 支付时候会报错
						url = this.landingPage
						if (this.wxConfig === false) {
							Utils.wxConfig(url).then((r) => {
								this.setWxConfig(true)
							})
						}
					} else {
						Utils.wxConfig(url)
					}
				}
			}
		},
		onDeviceReady(device) {
			this.$patch((state) => {
				state.device = device
			})
		},
		setDevice(device) {
			this.$patch((state) => {
				state.device = device
			})
		},
		setShowLogin(show) {
			this.showLogin = show
		},
		setShowDrawer(show) {
			this.showDrawer = show
		},
		showAlert(show) {
			this.showAlert = show
		},
		alert(alert) {
			if (typeof alert === 'object') {
				this.alert = {
					message: alert.message,
					color: alert.color,
					timeout: alert.timeout ? alert.timeout * 1000 : 5000
				}
			} else {
				this.alert = {
					message: alert,
					color: 'warning',
					timeout: alert.timeout ? alert.timeout * 1000 : 5000
				}
			}
			this.showAlert = true
		},

		share(info) {
			this.shareInfo = info
			this.showShare = true
		},
		setLoading(loading) {
			this.loading = loading
		},
		setLandingUrl(url) {
			if (window.cordova) {
			} else {
				if (!this.landingUrl) {
					// console.log('setLandingUrl',url)
					this.landingUrl = url
				} else {
					// console.log('existing landingUrl',state.landingUrl)
				}
			}
		},
		setTheme(theme) {
			this.theme = theme
		},
		setSettings(settings) {
			this.settings = settings
		},
		setVersion(version) {
			this.version = version
		},
		toggleBGM() {
			let to = !this.backgroundMusicPlaying
			this.backgroundMusicPlaying = saveBackgroundMusic(to)
		},
		toggleDrawer() {
			this.showDrawer = !this.showDrawer
		},
		setBackgroundMusicPlaying(to) {
			this.backgroundMusicPlaying = to
		},
		setWxConfig(to) {
			this.wxConfig = to
		},
		setLocale(l) {
			this.locale = saveLocale(l)
			i18n.global.locale = this.locale
		}
	}
})
