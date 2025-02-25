import Countly from 'countly-sdk-web'

const Tracker = {
	init(params) {
		if(process.env.NODE_ENV == 'production') {
			if(window.cordova) {

				// Countly.isInitialized().then((result) => {
				// 	if (result != "true") {
				// 		Countly.setLoggingEnabled(true); // Enable countly internal debugging logs
				// 		Countly.enableCrashReporting(); // Enable crash reporting to report unhandled crashes to Countly
				// 		Countly.setRequiresConsent(true); // Set that consent should be required for features to work.
				// 		Countly.giveConsentInit(["location", "sessions", "attribution", "push", "events", "views", "crashes", "users", "push", "star-rating", "apm"]); // give conset for specific features before init.
				// 		Countly.setLocationInit("41.0082", "28.9784", "TR", "Istanbul", "10.2.33.12"); // Set user initial location.
				//
				// 		/** Optional settings for Countly initialisation */
				// 		Countly.enableParameterTamperingProtection("salt"); // Set the optional salt to be used for calculating the checksum of requested data which will be sent with each request
				// 		// Countly.pinnedCertificates("count.ly.cer"); // It will ensure that connection is made with one of the public keys specified
				// 		Countly.setHttpPostForced(false); // Set to "true" if you want HTTP POST to be used for all requests
				// 		Countly.enableApm(); // Enable APM features, which includes the recording of app start time.
				// 		Countly.enableAttribution(); // Enable to measure your marketing campaign performance by attributing installs from specific campaigns.
				// 		Countly.setRemoteConfigAutomaticDownload(function(r){
				// 			console.log("[CountlyCordova] onSuccess : " + r)
				// 		}, function(r){
				// 			console.log("[CountlyCordova] onError : " + r);
				// 		}); // Set Automatic value download happens when the SDK is initiated or when the device ID is changed
				// 		Countly.pushTokenType(Countly.messagingMode.TEST); // Set messaging mode for push notifications
				//
				// 		Countly.init(soul.countlyApp.url, soul.countlyApp.app_key).then((result) => {
				// 			/**
				// 			 * Push notifications settings
				// 			 * Should be call after init
				// 			 */
				// 			Countly.onNotification(function(theNotification){
				// 				console.log("[CountlyCordova] onNotification : " + JSON.stringify(theNotification));
				// 			}); // Set callback to receive push notifications
				// 			Countly.askForNotificationPermission(); // This method will ask for permission, enables push notification and send push token to countly server.
				//
				// 			Countly.giveAllConsent(); // give consent for all features, should be call after init
				// 			// Countly.giveConsent(["events", "views"]); // give conset for some specific features, should be call after init.
				// 		},(err) => {
				// 			console.error(err);
				// 		});
				// 	}
				// },(err) => {
				// 	console.error(err);
				// })

			}else{
				Countly.init(params);
				Countly.q.push(['track_errors'])
				Countly.q.push(['track_sessions']);
				//注意需要加载boomerang.js
				//automatically report traces
				Countly.q.push(["track_performance", {
					//page load timing
					RT:{},
					//required for automated networking traces
					instrument_xhr: true,
					captureXhrRequestResponse: true,
					AutoXHR: {
						alwaysSendXhr: true,
						monitorFetch: true,
						captureXhrRequestResponse: true
					},
					//required for screen freeze traces
					Continuity: {
						enabled: true,
						monitorLongTasks: true,
						monitorPageBusy: true,
						monitorFrameRate: true,
						monitorInteractions: true,
						afterOnload: true
					}
				}]);
				// Countly.q.push(['enable_feedback',{'popups':['6140b4d803792209088659a8']}]);
			}
		}
	},
	event(name,params) {
		params.key = name
		Countly.q.push(['add_event',params]);
		/*Countly.q.push(['add_event',{
			key:"asyncButtonClick",
			segmentation: {
				"id": ob.id
			}
		}]);*/
	},
	click(params) {
		params.key = 'click'
		Countly.q.push(['add_event',params]);
	},
	pgv(pagename){
		Countly.q.push(['track_pageview',pagename]);
	}
}

export default Tracker
