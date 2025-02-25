
//ref:https://www.sitepoint.com/using-healthkit-with-a-cordova-app/

import * as Vue from 'vue'

const HealthKit = {
	init(){
		if(!window.plugins.healthkit){
			console.error('cordova healthkit plugin not installed')
		}
	},
	available(callback){
		window.plugins.healthkit.available(callback)
	},
	requestAuthorization(auths,successFn,failFn) {
		window.plugins.healthkit.requestAuthorization(auths,successFn,failFn)
    },
    checkAuthStatus(auths,successFn,failFn) {
		window.plugins.healthkit.checkAuthStatus(auths, successFn,failFn);
    },
	saveCorrelation(correlation,successFn,failFun) {
		window.plugins.healthkit.saveCorrelation(correlation, successFn, failFun)
	}
}

if (process.env.NODE_ENV === 'production') {
    Vue.prototype.$healthkit = HealthKit
} else {
    Vue.prototype.$healthkit = HealthKit
}

export default HealthKit
