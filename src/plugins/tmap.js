
import VS2 from 'vue-script2'
function initTMap(appKey){
	return new Promise((resolve, reject) => {
		if (typeof TMap === 'undefined' || !TMap.Map) {
			let self = this
			VS2.load(
				`https://map.qq.com/api/gljs?v=1.exp&key=${appKey}`
			)
				.then((r) => {
					resolve(true)
				})
				.catch((e) => {
					reject(e)
				})
		} else resolve(true)
	})
}
export default initTMap
