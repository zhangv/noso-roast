// import API from '../api-rm' //返回401无法回调登录框
// export default API

import http from './http'
import APIs from '../../../utils/src/APIs.js'

const API = new APIs(http)
export default API
