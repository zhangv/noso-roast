import axios from 'axios'
import promise from 'es6-promise'
import { blobSaveFile } from './utils-funcs'
import { loadToken } from './cache'
promise.polyfill()

class Http {
	constructor(
		{ baseURL = '/', timeout = 15000 },
		headers = {},
		statusCallbacks = {}
	) {
		this.service = axios.create({
			//   withCredentials: true,
			baseURL: baseURL,
			timeout: timeout,
			headers: {
				...headers
			}
		})

		this.statusCallbacks = statusCallbacks

		//请求队列
		this.MAX_CONCURRENT_REQUESTS = 5
		this.activeRequests = 0
		this.requestQueue = []

		this.service.interceptors.request.use(
			(config) => this.handleRequest(config),
			// (config) => {
			// 	this.enqueueRequest(config)
			// 	return this.handleRequest(config)
			// }, //不能用
			(error) => Promise.reject(error)
		)

		this.service.interceptors.response.use(
			(response) => {
				// this.handleFinally()
				return this.handleResponse(response)
			},
			(error) => {
				// this.handleFinally()
				return this.handleError(error)
			}
		)
	}
	enqueueRequest(config) {
		return new Promise((resolve, reject) => {
			this.requestQueue.push({ resolve, reject, config })
			console.log('enqueueRequest', config.url)
			return this.handleRequest(config)
		})
	}
	handleFinally() {
		this.activeRequests--
		this.processQueue()
	}

	processQueue() {
		if (
			this.requestQueue.length === 0 ||
			this.activeRequests >= this.MAX_CONCURRENT_REQUESTS
		) {
			return
		}
		const { resolve, reject, config } = this.requestQueue.shift()
		this.activeRequests++
		// console.log('processing', config.url)
		this.service(config)
			.then(resolve)
			.catch(reject)
			.finally(() => {
				this.activeRequests--
				this.processQueue()
			})
	}
	handleRequest(config) {
		if (!config.headers['token']) {
			const token = loadToken()
			if (token) {
				config.headers.Authorization = 'Bearer ' + token
			}
		}
		return config
	}
	handleResponse(res) {
		if (res.status === 200) {
			const data = res.data
			if (parseInt(data.code) === 0) {
				return Promise.resolve(data.data)
			} else {
				return Promise.reject(data)
			}
		}
		// handle other status codes
	}

	handleError(error) {
		// console.log('handleError', error)
		let msg
		if (error.response) {
			// console.log('calbacks', this.statusCallbacks)
			// console.log(this.statusCallbacks[error.response.status])
			if (this.statusCallbacks) {
				let statusCB = this.statusCallbacks[error.response.status]
				if (statusCB) {
					statusCB()
				}
			} else {
				if (!(msg = error.response.data.msg)) {
					switch (error.response.status) {
						case 400:
							msg = '请求错误(400)'
							break
						case 401:
							msg = '未授权，请重新登录(401)'
							break
						case 403:
							msg = '拒绝访问(403)'
							break
						case 404:
							msg = '请求路径未找到(404)'
							break
						case 408:
							msg = '请求超时(408)'
							break
						case 500:
							msg = '服务器错误(500)'
							break
						case 501:
							msg = '服务未实现(501)'
							break
						case 502:
							msg = '网关错误(502)'
							break
						case 503:
							msg = '服务不可用(503)'
							break
						case 504:
							msg = '网络超时(504)'
							break
						case 505:
							msg = 'HTTP版本不受支持(505)'
							break
						default:
							msg = `连接出错(${error.response.status})！`
					}
				} else msg = '请求无响应'
			}
		} else if (error.request) {
			console.log('请求无响应', error.request, error)
		} else {
			console.log('Error', error.message, error)
		}
		// 处理 AxiosError: No error message
		if (!error.message) {
			let errorurl = 'unknown err url'
			if (error.config && error.config.url) {
				errorurl = error.config.url
			}
			console.error('AxiosError: No error message', errorurl)
		}
		error.message = msg
		return Promise.reject(error)
	}

	//   request(axiosConfig) {
	// 	return service(axiosConfig)
	//   }
	get(url, params, config) {
		// console.log('get', params)
		// return this.service({
		//   ...config,
		//   url,
		//   method: "GET",
		//   params,
		//   paramsSerializer: (params) => {
		// 	return qs.stringify(params, { indices: false })
		//   },
		// })
		return this.service.get(url, params, config)
	}
	/** post application/x-www-form-urlencoded */
	post(url, data, config) {
		// return this.service({
		//   url,
		//   data,
		//   method: "POST",
		//   ...config,
		//   transformRequest: [
		// 	(data) => {
		// 	  return qs.stringify(data, { indices: false })
		// 	},
		//   ],
		// })
		return this.service.post(url, data, config)
	}
	/** post application/json */
	postJson(url, data, config) {
		return this.service({
			method: 'POST',
			url: url,
			data: data,
			...config,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
	}
	/** post multipart/form-data */
	postForm(url, data) {
		return this.service({
			method: 'POST',
			url,
			data,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	}
	/** 下载文件 responseType: "blob"  */
	downloadFile(config) {
		// @ts-ignore
		return this.service({
			// 1s
			timeout: 60 * 1000,
			...config,
			responseType: 'blob'
		})
	}
	/** 下载文件并保存 */
	downloadFileSava(config, defaultFileName) {
		const loadingInstance = Loading.service({
			fullscreen: true,
			text: '下载中',
			background: 'rgba(0, 0, 0, 0.08)'
		})

		return http.downloadFile(config).then(
			(res) => {
				loadingInstance.close()
				const { data } = res
				const fileName = res.fileName || defaultFileName || ''
				blobSaveFile(data, fileName)
				return res
			},
			(err) => {
				loadingInstance.close()
				return err
			}
		)
	}
}

export default Http
