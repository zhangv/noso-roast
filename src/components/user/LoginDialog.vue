<template>
	<v-dialog v-model="showLogin">
		<v-card>
			<v-card-title class="d-flex justify-center">登录</v-card-title>
			<v-card-text>
				<login-form @success="onSuccess" />
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { useRootStore } from '@/stores/root'
import { useVisitorStore } from '@/stores/visitor'
import Utils from '@/utils/utils'
import { PageDialog, MobileLoginForm, LoginForm } from '@ui'
import { mapState, mapWritableState, mapActions } from 'pinia'

export default {
	data() {
		return {
			// modes: {
			//     mobile: '手机登录',
			//     password: '密码登录'
			// },
			mode: null, //default mobile, /password
			isIOS: Utils.isIOS(),
			isMobile: Utils.isMobile(),
			isTablet: Utils.isTablet(),
			isWechat: Utils.isWechat(),
			isWechatApp: Utils.isWechatApp(),
			isApp: Utils.isApp(),
			isAppIOS: Utils.isAppIOS()
		}
	},
	computed: {
		...mapWritableState(useRootStore, ['showLogin']),
		...mapState(useRootStore, ['device'])
	},
	mounted() {
		if (!this.isWechat && !this.isWechatApp) {
			this.mode = 'mobile'
		}
	},
	methods: {
		...mapActions(useVisitorStore, ['setReturnURL', 'onLoggedIn']),
		setMode(mode) {
			if (this.mode === mode) this.mode = false
			else this.mode = mode
		},
		forgot() {
			this.$router.push({ path: '/user/forgotpassword' })
			this.showLogin = false
		},
		register() {
			this.setReturnURL(this.$router.currentRoute.fullPath)
			this.$router.push('/user/register')
			this.showLogin = false
		},
		onSuccess(res) {
			console.log('onSuccess', res)
			this.onLoggedIn(res)
			this.showLogin = false
		},
		wechatLogin() {
			//如果是router拦截弹出的，这里的currentRoute就是 '/'
			this.setReturnURL(this.$router.currentRoute.fullPath)
			if (this.isApp) {
				this.$router.push({ path: '/oauth/wechatmobileapp' }) //location.href 在app中无法使用
			} else {
				if (this.isWechat) {
					if (this.isWechatApp) {
						location.href = '/oauth/wechatapp'
					} else {
						location.href = '/oauth/wechat'
					}
				} else {
					//非微信浏览器
					location.href = '/oauth/wechat'
				}
			}
		},
		appleLogin() {
			this.setReturnURL(this.$router.currentRoute.fullPath)
			if (this.isApp) {
				this.$router.push({ path: '/oauth/appleapp' })
			} else {
				this.$router.push({ path: '/oauth/appleweb' })
			}
		},
		touchIdLogin() {
			//ref:https://github.com/EddyVerbruggen/cordova-plugin-touch-id
			if (this.$touchid) {
				//todo 真机上点击无反映
				let self = this
				let touchIdType = null
				this.$touchid.isAvailable(
					function (type) {
						// console.log(type)  // type returned to success callback: 'face' on iPhone X, 'touch' on other devices
						touchIdType = type + 'id'
						let message =
							type === 'face' ? self.$t('member.touchid_scan_face') : self.$t('member.touchid_scan_touch')
						self.$touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
							message, // this will be shown in the native scanner popup
							self.$t('member.touchid_enter_pin'),
							function (msg) {
								// success handler: fingerprint accepted
								console.log('msg', msg)
								self.$http
									.post(`/oauth/loginByTouchId`, {
										id: self.device.uuid,
										type: touchIdType
									})
									.then((r) => {
										console.log(r)
										self.onLoggedIn(r)
									})
							},
							function (msg) {
								// error handler with errorcode and localised reason
								console.log('not ok: ' + JSON.stringify(msg))
							}
						)
					},
					function (msg) {
						// error handler: no TouchID available
						alert('not available, message: ' + msg)
					}
				)
			} else {
				console.log('touchid not initialized')
			}
		}
	},
	components: {
		LoginForm,
		MobileLoginForm,
		PageDialog
	}
}
</script>
