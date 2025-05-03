// import API from '../api-rm' //返回401无法回调登录框
// export default API

import http2 from './http2'
import APIs2 from '../../../utils/src/APIs2.js'

const API2 = new APIs2(http2)
export default API2
