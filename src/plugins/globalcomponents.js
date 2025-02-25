// import GoBackButton from '@/components/common/GoBackButton'
// import ToTopButton from '@/components/common/ToTopButton'
// import QrCode from '@/components/common/QrCode'
import {
	GoBackButton,
	ToTopButton,
	QrCode,
	MessageBox
} from 'biasura-ui/src/components/lite'
function plugins(Vue) {
	Vue.component('go-back-btn', GoBackButton)
	Vue.component('go-back-button', GoBackButton)
	Vue.component('to-top-btn', ToTopButton)
	Vue.component('to-top-button', ToTopButton)
	Vue.component('qr-code', QrCode)
	Vue.component('message-box', MessageBox)
}

export default plugins
