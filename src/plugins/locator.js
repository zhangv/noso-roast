import wx from 'weixin-js-sdk';
// import AMapLoader from '@amap/amap-jsapi-loader';
import VS2 from 'vue-script2'
import gcoord from 'gcoord'; //npm i gcoord
/**
 * NOTE：Chrome、IOS10等已不再支持非安全域的浏览器定位请求
 */
function log(l) {
	console.log(JSON.stringify(l))
}

function loadScripts(scripts, callback) { //deprecated
	if (!(scripts instanceof Array)) scripts = [scripts]
	var styles = [];
	var filesloaded = 0;
	var filestoload = scripts.length + styles.length;
	for (var i = 0; i < scripts.length; i++) {
		// log('Loading script ' + scripts[i]);
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scripts[i];
		script.onload = function () {
			log('Loaded script');
			// log(this);
			filesloaded++; // (This means increment, i.e. add one)
			finishLoad();
		};
		document.head.appendChild(script);
	}

	function finishLoad() {
		if (filesloaded === filestoload) {
			callback();
		}
	}
}
var locator = function () {
	var serviceProvider = null
	var serviceOptions = null
	var serviceType = null
	var initialized = false
	var debug = false
	return {
		init: function (type, options, cb) {
			serviceType = type
			serviceOptions = options
			if (serviceType == 'qq') {
				var appKey = serviceOptions.appKey
				var appName = serviceOptions.appName
				// loadScripts(`https://apis.map.qq.com/tools/geolocation/min?key=${appKey}&referer=${appName}`,r => {
				// 	serviceProvider = new qq.maps.Geolocation()
				// 	initialized = true
				// 	cb()
				// })
				VS2.load(`https://apis.map.qq.com/tools/geolocation/min?key=${appKey}&referer=${appName}`).then(r => {
					serviceProvider = new qq.maps.Geolocation()
					initialized = true
					cb()
				})
			}
			if (serviceType == 'wx') {
				//Later
			}
		},
		getLocation: function (cb, ecb, options) {
			// console.log(`getLocation by ${serviceType}`)
			if (!serviceType || serviceType == 'native') {
				if (navigator.geolocation) {
					//浏览器自带的定位组件
					//chrome下会警告：Only request geolocation information in response to a user gesture.
					navigator.geolocation.getCurrentPosition(
						cb, ecb, options
					)
				} else {
					alert('navigator.geolocation not supported')
				}
			} else {
				if (serviceType == 'qq') {
					// serviceProvider.getLocation(cb, ecb, options);
					serviceProvider.getLocation(pos => {
						var res = pos.coords;
						var result = gcoord.transform( //转换为通用坐标系
							[res.longitude, res.latitude], // 经纬度坐标
							gcoord.WGS84, // 当前坐标系
							gcoord.GCJ02 // 目标坐标系
						);
						cb(result)
					}, ecb, {
						enableHighAccuracy: options['enableHighAccuracy'] ? options['enableHighAccuracy'] : true,
						timeout: options['timeout'] ? options['timeout'] : 3000,
						maximumAge: options['maximumAge'] ? options['maximumAge'] : 0
					})
				}
				if (serviceType == 'wx') {
					wx.getLocation({
						type: options['type'] ? options['type'] : 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						success: cb,
						fail: ecb,
						complete: cb,
						altitude: options['altitude'] ? options['altitude'] : true,
						highAccuracyExpireTime: options['highAccuracyExpireTime'] ? options['highAccuracyExpireTime'] : 3000,
						isHighAccuracy: options['isHighAccuracy'] ? options['isHighAccuracy'] : true
					})
				}
			}
		},
		watchLocation: function (cb, options) {
			if (serviceType == 'qq') {
				serviceProvider.watchPosition(cb, options)
			}
			alert("watchLocation not implemented" + serviceType)
		},
		clearWatchLocation: function () {
			if (serviceType == 'qq') {
				serviceProvider.clearWatch()
			}
			alert("watchLocation not implemented")
		},
		getAddress: function (lat, lng, cb, ecb) {
			if (serviceType == 'qq') {
				VS2.load(`https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${serviceOptions.appKey}`).then(r => {
					var latlng = new TMap.LatLng(lat, lng)
					// console.log('getAddress',lat, lng, latlng)
					let geocoder = new TMap.service.Geocoder()
					geocoder.getAddress({
						location: latlng
					}).then(r => cb(r)).catch(e => ecb(e))
				})
			} else {
				alert("getAddress not implemented for type - " + serviceType)
			}
		},
		getDistance: function (flat, flng, tlat, tlng) {
			if (serviceType == 'qq') {
				return new Promise((resolve, reject) => {
					VS2.load(`https://map.qq.com/api/gljs?v=1.exp&libraries=geometry&key=${serviceOptions.appKey}`).then(r => {
						var startPoint = new TMap.LatLng(flat, flng);
						var endPoint = new TMap.LatLng(tlat, tlng);
						var path = [startPoint, endPoint]
						// 计算路径的实际距离
						var distance = TMap.geometry.computeDistance(path);
						// console.log('locator.getdistance',distance)
						resolve(distance)
					})
				})
			} else {
				alert("getDistance not implemented for type - " + serviceType)
			}
		}
	}
}

const Locator = {
	qqMapService: null,
	AMap: null,
	wx: null,


	getLocation(successCallback, errorCallback, options) {
		if (navigator.geolocation) {
			//浏览器自带的定位组件
			//chrome下会警告：Only request geolocation information in response to a user gesture.
			navigator.geolocation.getCurrentPosition(
				successCallback, errorCallback, options
			)
		} else {
			alert('navigator.geolocation not supported')
		}
	},
	initQQMap({
		appKey,
		appName
	}, cb) {
		let self = this
		loadScripts(`https://apis.map.qq.com/tools/geolocation/min?key=${appKey}&referer=${appName}`, r => {
			self.qqMapService = new qq.maps.Geolocation()
			cb()
		})
	},
	getLocationByQQMap(successCallback, errorCallback, options) {
		this.qqMapService.getLocation(successCallback, errorCallback, options);
	},
	watchLocationQQ(callback) {
		this.qqMapService.watchPosition(callback)
	},
	clearWatchQQ() {
		this.qqMapService.clearWatch()
	},
	getIpLocationByQQMap(successCallback, errorCallback, options) {
		this.qqMapService = new qq.maps.Geolocation()
		this.qqMapService.getIpLocation(successCallback, errorCallback, options);
	},
	getLocationByWX(successCallback, failCallback, completeCallback, options) {
		if (wx) {
			// wx.ready(function() {
			wx.getLocation({
				type: options['type'] ? options['type'] : 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: successCallback,
				fail: failCallback,
				complete: completeCallback,
				altitude: true,
				highAccuracyExpireTime: 3000,
				isHighAccuracy: true
			})
			// })
		} else {
			alert('getLocationByWX should be called inside wechat browser')
		}
	},
	getAddress(lat, lng, successCallback, errorCallback) {
		var latlng = new qq.maps.LatLng(lat, lng)
		log('getAddress', lat, lng, latlng)
		let geocoder = new qq.maps.Geocoder({
			complete: successCallback,
			error: errorCallback
		})
		// console.log('geocoder', geocoder)
		geocoder.getAddress(latlng)
	}
	//注意：只有推荐的loader方式加载，不再使用之前的同步/异步引入js的方式
	// initAMap(options){ //ref: https://lbs.amap.com/api/jsapi-v2/guide/abc/load
	// 	//<script src="https://webapi.amap.com/loader.js"></script>
	// 	// 禁止多种API加载方式混用
	// 	return new Promise((resolve,reject) =>{
	// 		AMapLoader.load(options).then( amap => {
	// 			AMap = amap
	// 			resolve(amap)
	// 		}).catch( e => {
	// 			reject(e)
	// 		})
	// 	})
	// },
	// getLocationByAMap(successCallback, errorCallback, options) {
	// 	var mapObj = new AMap.Map('iCenter');
	// 	mapObj.plugin('AMap.Geolocation', function () {
	// 		var geolocation = new AMap.Geolocation({
	// 			enableHighAccuracy: true,//是否使用高精度定位，默认:true
	// 			timeout: 10000,          //超过10秒后停止定位，默认：无穷大
	// 			maximumAge: 0,           //定位结果缓存0毫秒，默认：0
	// 			convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
	// 			showButton: true,        //显示定位按钮，默认：true
	// 			buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
	// 			buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	// 			showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
	// 			showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
	// 			panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
	// 			zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	// 		});
	// 		mapObj.addControl(geolocation);
	// 		geolocation.getCurrentPosition();
	// 		AMap.event.addListener(geolocation, 'complete', successCallback);//返回定位信息
	// 		AMap.event.addListener(geolocation, 'error', errorCallback);      //返回定位出错信息
	// 	});
	// },
}

export default locator
