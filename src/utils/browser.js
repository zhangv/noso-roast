import MobileDetect from 'mobile-detect';

var browser = {
	isIOS(){
		var os = new MobileDetect(window.navigator.userAgent).os();
		return ['iOS','iPadOS'].includes(os)
	},
	isMobile(){// app
		return new MobileDetect(window.navigator.userAgent).phone();
	},
	isTablet(){
		return new MobileDetect(window.navigator.userAgent).tablet();
	},
	isAlipay() {
		var ua = navigator.userAgent
		return ua.indexOf('AlipayClient') !== -1
	},
	isWechatApp() {
		var ua = navigator.userAgent.toLowerCase()
		return (
			ua.indexOf('micromessenger') !== -1 &&
			(ua.indexOf('miniProgram') !== -1 || //android
				ua.indexOf('miniprogram') !== -1)
		)
	},
	isWechat() {
		var ua = navigator.userAgent.toLowerCase()
		return ua.indexOf('micromessenger') !== -1
	},
	isApp(){
		return window.cordova
	},
	isAppIOS(){
		return window.cordova && window.cordova.platformId === 'ios'
	},
	platform:(function(){

	}),
    versions: (function() {
        var u = navigator.userAgent
        return {
            // 判断是否IE内核
            trident: u.indexOf('Trident') > -1,
            // 判断是否opera内核
            presto: u.indexOf('Presto') > -1,
            // 判断是webKit苹果谷歌内核
            webKit: u.indexOf('AppleWebKit') > -1,
            // 判断是否火狐内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,

            // 判断浏览器类型
            firefox: u.indexOf('Firefox') > -1,
            chrome: u.indexOf('Chrome') > -1,
            safari: !u.indexOf('Chrome') > -1 && u.indexOf('Safari') > -1,
            opera: u.indexOf('Opera') > -1,
            ie: u.indexOf('MSIE') > -1,

            // 判断是否为移动终端
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            // 判断是否为Windows平台
            windows: u.indexOf('Windows'),

            // 判断是否ios终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            // 判断是否android终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
            // 判断是否为iPhone终端
            iPhone: u.indexOf('iPhone') > -1,
            // 判断是否iPad
            iPad: u.indexOf('iPad') > -1,
            // 判断是否iPod
            iPod: u.indexOf('iPod') > -1,
            //是否web应用程序
            webApp: u.indexOf('Safari') == -1,

            // 判断是否微信浏览器
            weixin: u.indexOf('MicroMessenger') > -1,
            // 判断是否为QQ浏览器
            qq: u.match(/\sQQ/i) == ' qq', //是否QQ

			wechatapp: u.indexOf('micromessenger') !== -1 &&
				(u.indexOf('miniProgram') !== -1 || //android
					u.indexOf('miniprogram') !== -1),
			alipay: u.indexOf('AlipayClient') !== -1,

			device: window.device ? window.device : {}
        }
    })()
}
export default browser
