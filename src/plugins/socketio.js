import * as Vue from 'vue'
import store from '../store/'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.use(new VueSocketIO({
	debug: true,
	connection: SocketIO(process.env.VUE_APP_SOCKET_SERVER,{
		path:'/messaging/',
		transports: ['websocket', 'xhr-polling', 'jsonp-polling'], //todo websocket的跨域问题
	}),
	vuex: {// 不需要用到vuex这个可以不加
		store,
		actionPrefix: 'SOCKET_',
		mutationPrefix: 'SOCKET_',
		options: {
			useConnectionNamespace: false
		}
	}
}))
//另一种初始化方式：
// Vue.use(VueSocketio,socketio(process.env.VUE_APP_SOCKET_SERVER), store);
