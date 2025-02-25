import router from '@/router';

const Pusher = {
	init(params) {

		this.initiateUI()

		window.JPush.getUserNotificationSettings(function(result) {
			if(result == 0) {
				// 系统设置中已关闭应用推送。
				console.log('closed settting')
			} else if(result > 0) {
				// 系统设置中打开了应用推送。
				console.log('allowed')
			}
		})

		document.addEventListener('jpush.receiveRegistrationId', function(event) {
			console.log("receiveRegistrationId" + JSON.stringify(event));
		}, false)

		//获取点击通知内容
		document.addEventListener("jpush.openNotification", function (event) {
			window.JPush.setBadge(0)
			var alertContent
			if(device.platform == "Android") {
				alertContent = event.alert
				let url = event.url
				if(url) {
					router.push({path:url})
				}
				// {
				// 	"title": "title",
				// 	"alert":"ding",
				// 	"extras":{
				// 	"yourKey": "yourValue",
				// 		"cn.jpush.android.MSG_ID": "1691785879",
				// 		"app": "com.thi.pushtest",
				// 		"cn.jpush.android.ALERT": "ding",
				// 		"cn.jpush.android.EXTRA": {},
				// 	"cn.jpush.android.PUSH_ID": "1691785879",
				// 		"cn.jpush.android.NOTIFICATION_ID": 1691785879,
				// 		"cn.jpush.android.NOTIFICATION_TYPE": "0"
				// }
				// }
			} else {
				alertContent = event.aps.alert
				let url = event.url
				if(url) {
					router.push({path:url})
				}
				// {
				// 	"aps": {
				// 	"badge": 1,
				// 		"sound": "default",
				// 		"alert": "今天去哪儿"
				// },
				// 	"key1": "value1",
				// 	"key2": "value2",
				// 	"_j_msgid": 154604475
				// }
			}
		}, false)

		//获取通知内容
		document.addEventListener("jpush.receiveNotification", function (event) {
			var alertContent
			if(device.platform == "Android") {
				alertContent = event.alert
			} else {
				alertContent = event.aps.alert
			}
			alert("open Notification:" + alertContent)
		}, false)

		//获取自定义消息推送内容
		document.addEventListener("jpush.receiveMessage", function (event) {
			var message
			if(device.platform == "Android") {
				message = event.message;
				// {
				// 	"message":"今天去哪儿",
				// 	"extras"{
				// 	"yourKey": "yourValue",
				// 		"cn.jpush.android.MSG_ID":"154378013",
				// 		"cn.jpush.android.CONTENT_TYPE":"",
				// 		"cn.jpush.android.EXTRA":{ "key":"不添加没有" }
				// }
				// }
			} else {
				message = event.content;
				// {
				// 	"content":"今天去哪儿",
				// 	"extras":{ "key":"不添加没有" }
				// }
			}
		}, false)
	},
	initiateUI() {
		try {
			window.JPush.setDebugMode(true);
			window.JPush.init();
			// window.setTimeout(getRegistrationID, 10000);
			window.JPush.getRegistrationID(function(rId) {
				console.log("JPushPlugin:registrationID is " + rId)
			})

			window.JPush.setBadge(0)
			if (device.platform != "Android") {
				window.JPush.setApplicationIconBadgeNumber(0);
			}

		} catch (exception) {
			alert('An exception has been occured when init JPush plugin.' + exception);
		}
	},

	getRegistrationID() {
		window.JPush.getRegistrationID(onGetRegistrationID)
	},

	onGetRegistrationID(data) {
		try {
			if (data.length === 0) {
				alert('id is null')
				var t1 = window.setTimeout(getRegistrationID, 5000);
			} else {
				alert(data)
			}
		} catch (exception) {
			console.log('onGetRegistrationID',exception);
		}
	}
}

export default Pusher
