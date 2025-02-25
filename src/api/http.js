import { Http } from '../../../utils'
import { useRootStore } from '@/stores/root'
import { useVisitorStore } from '@/stores/visitor'
import soul from '@/soul'
const http = new Http(
	{
		baseURL: soul.backEndHost,
		timeout: 5000 //有些请求比较慢,比如点单时候点击饮品分类
	},
	{
		'X-Requested-With': 'API/admin'
	},
	{
		401: () => {
			const visitorStore = useVisitorStore()
			visitorStore.clearLogin()
			const rootStore = useRootStore()

			console.warn(rootStore)
			// rootStore.setAlert('登录过期')
			rootStore.setShowLogin(true)
			console.log('401')
		}
	}
)

export default http
