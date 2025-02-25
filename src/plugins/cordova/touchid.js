
//https://github.com/EddyVerbruggen/cordova-plugin-touch-id#usage
import * as Vue from 'vue'

var TouchId = {
	isAvailable(successCallback,errorCallback){
		window.plugins.touchid.isAvailable(successCallback,errorCallback)
	},
	didFingerprintDatabaseChange( successCallback, errorCallback) {
		window.plugins.touchid.didFingerprintDatabaseChange(successCallback, errorCallback)
	},
	verifyFingerprint(message, successCallback, errorCallback) {
		window.plugins.touchid.verifyFingerprint(message, successCallback, errorCallback)
	},
	verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(message, enterPasswordLabel, successCallback, errorCallback) {
		window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(message, enterPasswordLabel, successCallback, errorCallback)
    },
	verifyFingerprintWithCustomPasswordFallback(message, successCallback, errorCallback) {
		window.plugins.touchid.verifyFingerprintWithCustomPasswordFallback(message, successCallback, errorCallback);
    },
	askPassword(message, successCallback, errorCallback) {
		window.plugins.touchid.askPassword(message, successCallback, errorCallback)
	}
}

var TouchIdMock = {
	isAvailable(successCallback,errorCallback){
		successCallback('touch')
	},
	didFingerprintDatabaseChange( successCallback, errorCallback) {
		let changed = false
		successCallback(changed)
	},
	verifyFingerprint(message, successCallback, errorCallback) {
		successCallback({
			msg:message
		})
	},
	verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(message, enterPasswordLabel, successCallback, errorCallback) {
		successCallback({
			msg:message
		})
	},
	verifyFingerprintWithCustomPasswordFallback(message, successCallback, errorCallback) {
		successCallback({
			msg:message
		})
	},
	askPassword(message, successCallback, errorCallback) {
		successCallback({
			msg:message
		})
	}
}

if (process.env.NODE_ENV === 'production') {
    Vue.prototype.$touchid = TouchId
} else {
    Vue.prototype.$touchid = TouchIdMock
}

export default TouchId
