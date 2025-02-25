//依赖axios/store/jswexin/tracker
import wx from 'weixin-js-sdk'
import store from 'store'
import API from '../api/'
import MobileDetect from 'mobile-detect'

class Utils {
	constructor() {}
	static isIOS() {
		var os = new MobileDetect(window.navigator.userAgent).os()
		return ['iOS', 'iPadOS'].includes(os)
	}
	static isMobile() {
		// app
		return new MobileDetect(window.navigator.userAgent).phone()
	}
	static isTablet() {
		return new MobileDetect(window.navigator.userAgent).tablet()
	}
	static isAlipay() {
		var ua = navigator.userAgent
		return ua.indexOf('AlipayClient') !== -1
	}
	static isWechatApp() {
		var ua = navigator.userAgent.toLowerCase()
		return (
			ua.indexOf('micromessenger') !== -1 &&
			(ua.indexOf('miniProgram') !== -1 || //android
				ua.indexOf('miniprogram') !== -1)
		)
	}
	static isWechat() {
		var ua = navigator.userAgent.toLowerCase()
		return ua.indexOf('micromessenger') !== -1
	}
	static isWechatEnterprise() {
		var ua = navigator.userAgent.toLowerCase()
		return (
			ua.match(/MicroMessenger/i) == 'micromessenger' &&
			ua.match(/wxwork/i) == 'wxwork'
		)
	}
	static isApp() {
		return window.cordova
	}
	static isAppIOS() {
		return window.cordova && window.cordova.platformId === 'ios'
	}
	wxReady(shareData) {
		if (typeof shareData === 'function') wx.ready(shareData)
		else
			wx.ready(function () {
				var hideMenuItems = []
				var showMenuItems = [
					//基本类
					'menuItem:profile', //查看公众号
					'menuItem:addContact', //查看公众号（未添加时）
					//传播类
					'menuItem:share:appMessage',
					'menuItem:share:timeline',
					'menuItem:favorite',
					'menuItem:share:qq',
					'menuItem:share:weiboApp',
					'menuItem:share:facebook',
					'menuItem:share:QZone',
					//保护类
					'menuItem:editTag',
					'menuItem:delete',
					'menuItem:copyUrl',
					'menuItem:originPage',
					'menuItem:readMore',
					'menuItem:openWithQQBrowser',
					'menuItem:openWithSafari',
					'menuItem:share:email'
				]

				wx.hideMenuItems({
					menuList: hideMenuItems
				})
				wx.showMenuItems({
					menuList: showMenuItems
				})
				wx.updateTimelineShareData(shareData) //新旧版同时兼容
				wx.updateAppMessageShareData(shareData) //新旧版同时兼容
			})
	}
	appendUrlParam(url, paraname, paravalue) {
		//替换对应参数的值 如果不存在就加上
		var aQuery = url.split('?') //取得Get参数
		var newparams = []
		if (aQuery.length > 1) {
			//需要处理已有参数
			var aBuf = aQuery[1].split('&')
			if (aBuf.length > 0) {
				var paraexists = false
				for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
					var aTmp = aBuf[i].split('=')
					if (aTmp[0] === '') continue //过滤空参数名
					var newparam = aTmp[0]
					if (aTmp[0] === paraname) {
						//要追加的参数已经存在
						if (paravalue && paravalue !== '')
							newparam += '=' + paravalue
						paraexists = true
					} else {
						//处理已有参数
						if (aTmp.length > 0) newparam += '=' + aTmp[1]
					}
					newparams.push(newparam)
				}
				if (paraexists === false) {
					var tmp = paraname
					if (paravalue && paravalue !== '') tmp += '=' + paravalue
					newparams.push(tmp)
				}
			}
		} else {
			//不存在任何参数
			newparams.push(paraname + '=' + paravalue)
		}
		newparams = newparams.join('&')
		return aQuery[0] + '?' + newparams
	}
	removeUrlParam(url, paras) {
		var aQuery = url.split('?') //取得Get参数
		var newparams = []
		if (aQuery.length > 1) {
			//需要处理已有参数
			var aBuf = aQuery[1].split('&')
			if (aBuf.length > 0) {
				for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
					var aTmp = aBuf[i].split('=')
					if (aTmp[0] === '') continue //过滤空参数名
					var newparam = aTmp[0]
					if (!paras.includes(aTmp[0])) {
						//不是要删除的参数
						if (aTmp.length > 0) newparam += '=' + aTmp[1]
						newparams.push(newparam)
					}
				}
			}
		}
		newparams = newparams.join('&')
		return aQuery[0] + '?' + newparams
	}
	normalizeUrl(url) {
		//检查url是否规范：是否有重复的参数、是否有多余的?/=
		//// 如果不规范，返回规范化后的url，如果规范，返回null
		var aQuery = url.split('?') //取得Get参数
		var newparams = []
		let paranames = []
		let originalParaCnt = 0
		if (aQuery.length > 1) {
			//需要处理已有参数
			var aBuf = aQuery[1].split('&')
			originalParaCnt = aBuf.length
			if (originalParaCnt > 0) {
				for (let i = 0; i < originalParaCnt; i++) {
					var aTmp = aBuf[i].split('=')
					if (aTmp[0] === '') continue //过滤空参数名
					let pname = aTmp[0]
					let pvalue = aTmp.length > 1 ? aTmp[1] : null
					if (!paranames.includes(pname)) {
						//不是要删除的参数
						if (aTmp.length > 0) {
							if (pvalue) {
								newparams.push(pname + '=' + pvalue)
							} else {
								newparams.push(pname)
							}
						}
						paranames.push(pname)
					}
				}
			}
		}
		let nothinghappened = paranames.length === originalParaCnt
		if (nothinghappened) return null
		else {
			return aQuery[0] + '?' + newparams.join('&')
		}
	}
	wxError(cb) {
		if (cb) wx.error(cb)
		else
			wx.error(function (res) {
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				console.log('wx.error', res)
				// Tracker.event('wxerror',JSON.stringify(res));
			})
	}
	wxConfig(url) {
		if (!this.isWechat() || this.isWechatApp()) return
		url = url ? url : window.location.href.split('#')[0]
		console.log('wxconfig url', url)
		if (process.env.NODE_ENV !== 'production') {
			return new Promise((resolve, reject) => {
				resolve({})
			})
		}
		return new Promise((resolve, reject) => {
			API.common.getWxSignPackage(
				url,
				(resp) => {
					var pack = resp
					console.log('config start', pack)
					wx.config({
						debug: false,
						appId: pack.appId,
						timestamp: pack.timestamp,
						nonceStr: pack.nonceStr,
						signature: pack.signature,
						// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						jsApiList: [
							'updateTimelineShareData',
							'updateAppMessageShareData', //新版本分享
							'checkJsApi',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem',
							'translateVoice',
							'startRecord',
							'stopRecord',
							'onRecordEnd',
							'playVoice',
							'pauseVoice',
							'stopVoice',
							'uploadVoice',
							'downloadVoice',
							'chooseImage',
							'previewImage',
							'uploadImage',
							'downloadImage',
							'getNetworkType',
							'openLocation',
							'getLocation',
							'hideOptionMenu',
							'showOptionMenu',
							'closeWindow',
							'scanQRCode',
							'chooseWXPay',
							'openProductSpecificView',
							'addCard',
							'chooseCard',
							'openCard',
							'openAddress'
						],
						openTagList: [
							'wx-open-launch-weapp',
							'wx-open-launch-app'
						] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
					})
					// console.log('config end')
					resolve(wx)
				},
				(err) => {
					console.log('err', err)
					reject(err)
				},
				{
					alertError: false
				}
			)
		})
	}
	setChannelInfo(k, val) {
		store.namespace('channel').clearAll()
		store.namespace('channel').set(k, val)
	}
	saveChannelInfoToLS() {
		var params = Utils.getAllUrlParams(window.location.href)
		if (params['channelid']) {
			store.namespace('channel').clearAll()
			store.namespace('channel').set('id', params['channelid'])
		} else {
			if (
				params['channel'] &&
				params['channel'] !== '' &&
				params['channeltype'] &&
				params['channeltype'] !== ''
			) {
				store.namespace('channel').clearAll()
				store.namespace('channel').set('code', params['channel'])
				store.namespace('channel').set('type', params['channeltype'])
			}
		}
	}
	getChannelInfoFromLS() {
		var channel = {
			id: store.namespace('channel').get('id'),
			code: store.namespace('channel').get('code'),
			type: store.namespace('channel').get('type')
		}
		return channel
	}
	clearChannelInfoFromLS() {
		store.namespace('channel').clearAll()
	}
	getParam(pname) {
		var all = this.getAllUrlParams()
		// console.log('allurlparams',all)
		if (all[pname]) {
			return all[pname]
		} else return null
	}
	getAllUrlParams(url) {
		//TODO:注意这个在cordova中获取不到！！！因为没有window.location
		// get query string from url (optional) or window
		var queryString = url
			? url.split('?')[1]
			: window.location.search.slice(1)
		// console.log('queryString',queryString)
		var obj = {}
		if (queryString) {
			// stuff after # is not part of query string, so get rid of it
			queryString = queryString.split('#')[0]
			// split our query string into its component parts
			var arr = queryString.split('&')
			console.log('arr', arr)
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].trim() == '') continue
				// separate the keys and the values
				var a = arr[i].split('=')
				// set parameter name and value (use 'true' if empty)
				var paramName = a[0]
				var paramValue = typeof a[1] === 'undefined' ? true : a[1]
				// (optional) keep case consistent
				paramName = paramName.toLowerCase()
				// if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase(); -- 天坑！！
				// if the paramName ends with square brackets, e.g. colors[] or colors[2]
				if (paramName.match(/\[(\d+)?\]$/)) {
					// create key if it doesn't exist
					var key = paramName.replace(/\[(\d+)?\]/, '')
					if (!obj[key]) obj[key] = []
					// if it's an indexed array e.g. colors[2]
					if (paramName.match(/\[\d+\]$/)) {
						// get the index value and add the entry at the appropriate position
						var index = /\[(\d+)\]/.exec(paramName)[1]
						obj[key][index] = paramValue
					} else {
						// otherwise add the value to the end of the array
						obj[key].push(paramValue)
					}
				} else {
					// we're dealing with a string
					if (!obj[paramName]) {
						// if it doesn't exist, create property
						obj[paramName] = paramValue
					} else if (
						obj[paramName] &&
						typeof obj[paramName] === 'string'
					) {
						// if property does exist and it's a string, convert it to an array
						obj[paramName] = [obj[paramName]]
						obj[paramName].push(paramValue)
					} else {
						// otherwise add the property
						obj[paramName].push(paramValue)
					}
				}
			}
		}
		return obj
	}
}

export default Utils
