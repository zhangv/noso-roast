import cookies from 'js-cookie'
import storage from './storage'
import { v5 as uuid } from 'uuid'

const LoginStatusKey = 'Login-Status' // 登录态 0 1 2
const TokenKey = 'Access-Token' // token
const UserInfoKey = 'User-Info' // 用户信息 {} {...}
const TrackIdKey = 'Track-Id'
const PromoterKey = 'Promoter' //推荐人
const SESSION_DAYS = 30 //保留登录状态30天

class Cache {
	constructor() {}
	loadCache(key, or = null) {
		return storage.get(key, or)
	}
	saveCache(key, data, expiration) {
		storage.set(key, data, expiration)
		return data
	}
}
export default Cache

export function initDeviceInfo() {
	// console.log('init deviceinfo',window.device)
	return {
		platform:
			window.cordova && window.device
				? window.device.platform
				: 'Browser',
		uuid:
			window.cordova && window.device ? window.device.uuid : loadTrackId()
	}
}
export function loadShop() {
	return storage.get('__shop', null)
}
export function saveShop(shopid) {
	storage.set('__shop', shopid)
	return shopid
}
export function loadDebugging() {
	return storage.get('debugging', false)
}
export function saveDebugging(flag) {
	storage.set('debugging', flag)
	return flag
}
export function loadCache(key, or = null) {
	return storage.get(key, or)
}
export function saveCache(key, data, expiration) {
	storage.set(key, data, expiration)
	return data
}
export function loadTheme() {
	return storage.get('theme', null)
}
export function saveTheme(t) {
	//30天
	const expiration = new Date().getTime() + 86400 * SESSION_DAYS * 1000
	storage.set('theme', t, expiration)
	return t
}
export function loadLocale() {
	return storage.get('locale', null)
}
export function saveLocale(locale) {
	storage.set('locale', locale)
	return locale
}
export function loadDiyMenu(shopid) {
	return storage.get(`diymenu-${shopid}`, null)
}
export function saveDiyMenu(shopid, menu) {
	//cache 5 mins
	const expiration = new Date().getTime() + 300 * 1000
	storage.set(`diymenu-${shopid}`, menu, expiration)
	return menu
}
export function loadDiyOrderItem() {
	return storage.get('diyorderitem', {
		items: [],
		skus: []
	})
}
export function saveDiyOrderItem(items, skus) {
	//cache 5 mins
	const expiration = new Date().getTime() + 300 * 1000
	storage.set(
		'diyorderitem',
		{
			items,
			skus
		},
		expiration
	)
	return {
		items,
		skus
	}
}
export function removeDiyOrderItem() {
	storage.remove('diyorderitem')
}
export function loadBackgroundMusic() {
	return storage.get('background-music', false)
}
export function saveBackgroundMusic(flag) {
	storage.set('background-music', flag)
	return flag
}
export function loadReturnURL() {
	return storage.get('return-url', null)
}
export function saveReturnURL(url) {
	if (url) {
		const expiration = new Date().getTime() + 300 * 1000 //5min
		storage.set('return-url', url, expiration)
	} else {
		storage.remove('return-url')
	}
	return url
}
export function loadLoginRedirect() {
	return storage.get('login-redirect', null)
}
export function saveLoginRedirect(url) {
	if (url) {
		const expiration = new Date().getTime() + 300 * 1000 //5min
		storage.set('login-redirect', url, expiration)
	} else {
		storage.remove('login-redirect')
	}
	return url
}
export function loadTrackIdCookie() {
	return cookies.get(TrackIdKey) || null
}
export function saveTrackIdCookie() {
	const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341' //todo 后续可用来做验证
	var tid = uuid('trackId', MY_NAMESPACE)
	// console.log(tid)
	cookies.set(TrackIdKey, tid, {
		// domain:'.biasura.com', //这个暂时不能加，测试环境会失败，因为是127。0.0.1
		expires: SESSION_DAYS
	})
	return tid
}
export function loadTrackId() {
	return storage.get(TrackIdKey, null)
}
export function saveTrackId() {
	const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341' //todo 后续可用来做验证
	var tid = uuid('trackId', MY_NAMESPACE)
	var expiration = new Date().getTime() + 86400 * SESSION_DAYS * 1000
	storage.set(TrackIdKey, tid, expiration)
	return tid
}

export function loadLoginStatus() {
	return parseInt(storage.get(LoginStatusKey, 0))
}

export function saveLoginStatus(status) {
	var expiration = new Date().getTime() + 86400 * SESSION_DAYS * 1000
	storage.set(LoginStatusKey, status, expiration)
	return status
}

export function removeLoginStatus() {
	// cookies.remove(LoginStatusKey)
	storage.remove(LoginStatusKey)
	return 0
}
export function loadLoginStatusCookie() {
	return parseInt(cookies.get(LoginStatusKey)) || 0
}

export function saveLoginStatusCookie(status) {
	cookies.set(LoginStatusKey, status, { expires: SESSION_DAYS })
	return status
}

export function removeLoginStatusCookie() {
	cookies.remove(LoginStatusKey)
	return 0
}

export function loadToken() {
	return storage.get(TokenKey, null)
	// return cookies.get(TokenKey) || null
}

export function saveToken(token) {
	var expiration = new Date().getTime() + 86400 * SESSION_DAYS * 1000
	storage.set(TokenKey, token, expiration)
	return token
}

export function removeToken() {
	storage.remove(TokenKey)
	// cookies.remove(TokenKey)
	return ''
}

export function loadUserInfo() {
	return storage.get(UserInfoKey, {})
}

export function saveUserInfo(userInfo) {
	var expiration = new Date().getTime() + 86400 * SESSION_DAYS * 1000
	storage.set(UserInfoKey, userInfo, expiration)
	return userInfo
}
export function removeUserInfo() {
	storage.remove(UserInfoKey)
	return {}
}
export function loadPromoter() {
	return storage.get(PromoterKey, null)
}

export function savePromoter(proId) {
	let expiration = new Date().getTime() + 86400 * 365 * 1000
	storage.set(PromoterKey, proId, expiration)
	return loadPromoter()
}

export function loadHomeDialogCount(id) {
	//首页弹出banner的周期显示次数
	let c = storage.get('homedialogcount', {})
	if (c && c.id && c.id === id) return c.count
	else return 0
}

export function incrHomeDialogCount(id, intervalHour) {
	let expiration = new Date().getTime() + 60 * 1000 * intervalHour
	let cur = loadHomeDialogCount(id)
	if (!cur) cur = 0
	let to = {
		id: id,
		count: cur + 1
	}
	storage.set('homedialogcount', to, expiration)
	return to
}
