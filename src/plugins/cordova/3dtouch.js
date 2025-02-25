import * as Vue from 'vue'

const ThreeDTouch = {
	init(callback){
		if(!ThreeDeeTouch){
			console.error('Cordova 3dtouch plugin not installed')
		}else{
			ThreeDeeTouch.isAvailable(avail => {
				if(avail === true){
					callback()
				}else{
					console.log('3D touch not available')
				}
			})
		}
	},
	isAvailable(callback){
		ThreeDeeTouch && ThreeDeeTouch.isAvailable(callback)
	},
	configureQuickActions(icons) {
		ThreeDeeTouch && ThreeDeeTouch.configureQuickActions(icons)
    },
	enableLinkPreview() {
		ThreeDeeTouch && ThreeDeeTouch.enableLinkPreview()
    },
	onHomeIconPressed(callback) {
		ThreeDeeTouch.onHomeIconPressed = callback
	},
	watchForceTouches(successFn){
		ThreeDeeTouch && ThreeDeeTouch.watchForceTouches(successFn)
	}
}

if (process.env.NODE_ENV === 'production') {
    Vue.prototype.$3dtouch = ThreeDTouch
} else {
    Vue.prototype.$3dtouch = ThreeDTouch
}

export default ThreeDTouch
