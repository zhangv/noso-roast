export function initWeixin(){
	if (!isWeixin()) {
		return
	}
	wx.config({
		debug: false,
		appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
		timestamp: timestamp, // 必填，生成签名的时间戳
		nonceStr: nonceStr, // 必填，生成签名的随机串
		signature: signature, // 必填，签名
		//需要微信权限列表
		jsApiList: [
			"onMenuShareAppMessage", // 分享给朋友
			"onMenuShareTimeline", // 分享到朋友圈
			"onMenuShareQQ", // 分享到QQ
			"onMenuShareQZone", // 分享到QQ空间
			"checkJsApi" //判断当前客户端版本是否支持指定JS接口
		],
		openTagList:['wx-open-launch-weapp'] // 微信开放标签 小程序跳转按钮：<wx-open-launch-weapp>
	});
}

// 动态生成标签
// info参数
/*
let params={
  eleId:"", // 元素ID
  appid:"", // 小程序id号 gh_****
  url:"", // 跳转小程序的页面路径地址 例: pages/home/home.html - (后面必须带上.html后缀 否则IOS跳转时出现小程序页面未配置)
  content:"" // html字符串 例: "<button>点我</button>"
}
*/
export function initWechatAppletBtn(info){
	if (!isWeixin()) {
		return
	}
	if(isValidVersion()){
		var btn = document.getElementById(info.eleId); //获取元素
		let script = document.createElement("script");// 创建script内容插槽 避免template标签冲突
		script.type = "text/wxtag-template"; // 使用script插槽 必须定义这个type
		script.text = info.content // 自定义的html字符串内容
		let html = `<wx-open-launch-weapp style="width:100%;display:block;" username="${info.appid}" path="${info.url}">${script.outerHTML}</wx-open-launch-weapp>`;
		btn.innerHTML = html; // html字符串赋值
		// 点击按钮 正常跳转触发
		btn.addEventListener("launch", function (e) {
			console.log("success");
		});
		// 点击跳转 抛出异常
		btn.addEventListener("error", function (e) {
			console.log("fail", e.detail);
			alert(`跳转异常 - ${e.detail}`)
		});
	}else{
		alert("您的版本号不支持")
	}
}

// 判断是否微信环境
function isWeixin() {
	return navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
}

// 判断当前微信版本号是否支持
function isValidVersion(){//7.0.12以上
	let valid = false; // 当前版本号是否支持 (默认不支持)
	let wxInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i); // 微信浏览器信息
	// 微信版本号 wxInfo[1] = "7.0.18.1740" (示例)
	//进行split转成数组进行判断 [7,0,18,1740] (示例)
	let version = wxInfo[1].split(".");
	version = version.map( e => parseInt(e))
	// 判断版本在7.0.12及以上的版本
	if (version[0]=== 7) {
		valid = (version[1] > 0 || (version[1] === 0 && version[2] >= 12))
	}else{
		valid = version[0] > 7
	}
	return valid;
}
