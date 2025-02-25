import * as Vue from 'vue'
import Vuetify from 'vuetify/lib'

/** vue-fontawesome **/
import { library } from '@fortawesome/fontawesome-svg-core'

import {fas} from '@fortawesome/free-solid-svg-icons'
import { faJs, faVuejs, faFacebookF,faWeibo,faWeixin,faAlipay,faTencentWeibo } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText} from '@fortawesome/vue-fontawesome'
library.add(fas)
library.add(
	faJs, faVuejs, faFacebookF,faWeibo,faWeixin,faAlipay,faTencentWeibo
)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
Vue.use(Vuetify)
/** vue-fontawesome EOF **/



