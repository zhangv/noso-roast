import { useRootStore } from './root'
import API from '@/api/'
import {
	loadLoginStatus,
	saveLoginStatus,
	removeLoginStatus,
	loadToken,
	saveToken,
	removeToken,
	loadUserInfo,
	saveUserInfo,
	removeUserInfo,
	loadReturnURL,
	saveReturnURL,
	loadLoginRedirect,
	saveLoginRedirect,
	loadDebugging,
	saveDebugging,
	loadPromoter,
	savePromoter,
	loadCache,
	saveCache,
	saveRefreshToken
} from '@utils/utils/cache'
import { defineStore } from 'pinia'
import qs from 'qs'

export const useVisitorStore = defineStore('visitor', {
	state: () => ({
		loginStatus: loadLoginStatus(), // 登录状态
		token: loadToken(), // token
		userInfo: loadUserInfo(), // 用户登录信息
		returnURL: loadReturnURL(), //这个主要给类似微信授权这种跳到站外授权用
		openid: null,
		loginRedirect: loadLoginRedirect(), // 和returnURL不同，这个主要是router中requireAuth时用
		roles: {}, //mapping
		groups: [],
		debugging: loadDebugging(),
		promoter: loadPromoter(),
		eruda: loadCache('eruda')
	}),
	getters: {
		isLoggedIn: (state) => {
			return state.loginStatus === 1 && state.token && state.userInfo
		},
		isAdmin: (state) => {
			return state.userInfo && state.userInfo.roles && state.userInfo.rolenames.includes('admin')
		},
		rolesByDomain: (state) => (domain, domainid) => {
			let key = `${domain}:${domainid}`
			return state.userInfo && state.userInfo.roleMap && state.userInfo.roleMap[key]
		},
		roleMap: (state) => {
			return state.userInfo && state.userInfo.roleMap
		}
	},
	actions: {
		setUserInfo(ui) {
			this.userInfo = saveUserInfo(ui)
		},
		setLoginStatus(loginStatus) {
			this.loginStatus = saveLoginStatus(loginStatus)
		},
		setToken(token) {
			this.token = saveToken(token)
		},
		setRefreshToken(refreshToken) {
			this.refreshToken = saveRefreshToken(refreshToken)
		},
		setReturnURL(url) {
			this.returnURL = saveReturnURL(url)
		},
		setOpenId(id) {
			this.openid = id
		},
		setLoginRedirect(to) {
			this.loginRedirect = saveLoginRedirect(to)
		},
		setDebugging(to) {
			this.debugging = saveDebugging(to)
		},
		setPromoter(to) {
			this.promoter = savePromoter(to)
		},
		setEruda(to) {
			this.eruda = saveCache('eruda', to)
		},
		onLoggedIn(res) {
			this.setUserInfo(res.userInfo)
			this.setToken(res.token)
			this.setRefreshToken(res.refreshToken)
			this.setLoginStatus(1)
		},
		afterRedirect() {
			this.setReturnUrl(null)
			this.setLoginRedirect(null)
		},
		wechatLogin(token) {
			API.auth.tokenLogin(token, (res) => {
				this.onLoggedIn(res)
			})
		},
		wechatLoginByCode(code) {
			return new Promise((resolve, reject) => {
				API.auth.wechatCodeLogin(
					code,
					(res) => {
						this.onLoggedIn(res)
						resolve(res)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		wechatMobileAppLoginByCode(code) {
			return new Promise((resolve, reject) => {
				API.auth.wechatMobileAppCodeLogin(
					code,
					(res) => {
						this.onLoggedIn(res)
						resolve(res)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		wechatappLogin(token) {
			return new Promise((resolve, reject) => {
				API.auth.tokenLogin(
					token,
					(res) => {
						this.onLoggedIn(res)
						resolve(res)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		wechatappAuth(token) {
			return new Promise((resolve, reject) => {
				API.auth.tokenLogin(
					token,
					(res) => {
						resolve(res)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		oauthLogin(token) {
			return new Promise((resolve, reject) => {
				API.auth.oauthLogin(
					token,
					(res) => {
						this.onLoggedIn(res)
						resolve(res)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		mobileLogin(form) {
			return new Promise((resolve, reject) => {
				API.auth.mobileLogin(
					form,
					(res) => {
						this.onLoggedIn(res)
						console.log('resolved000', res)
						resolve(res)
						console.log('resolved', res)
					},
					(err) => {
						reject(err)
					},
					{
						alertError: false
					}
				)
			})
		},
		login(form) {
			return new Promise((resolve, reject) => {
				API.auth.login(
					form,
					(res) => {
						this.onLoggedIn(res)
						resolve(res)
					},
					(err) => {
						reject(err)
					}
				)
			})
		},
		logout() {
			this.clearLogin()
			const rootStore = useRootStore()
			rootStore.setAlert('注销成功')
			rootStore.showLogin(false)
		},
		clearLogin() {
			//只是清理登录信息（如果api遇到401，则清理一下，避免有客户端的脏数据 - 不同步
			this.setUserInfo(removeUserInfo())
			this.setToken(removeToken())
			this.setLoginStatus(removeLoginStatus())
		},
		reloadUserInfo(query) {
			API.user.getUserInfo((r) => {
				this.setUserInfo(r)
			})
		},
		toggleDebugging() {
			this.setDebugging(!this.debugging)
		},
		toggleEruda() {
			this.setEruda = !this.eruda
		},
		checkPromoter() {
			let qps = qs.parse(location.search, {
				ignoreQueryPrefix: true
			})
			if (qps.pro) {
				let pid = savePromoter(qps.pro)
				if (pid) this.setPromoter(pid)
			}
		}
	}
})
