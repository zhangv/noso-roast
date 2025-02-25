import wx from 'weixin-js-sdk'
import * as Vue from 'vue'
//todo：判断是否微信内浏览器环境，是才初始化，否则忽略
let FakeWechat = {
    async chooseWXPay(params) {
        if (
            await confirm('选择结果' + JSON.stringify(params), {
                buttonTrueText: '成功',
                buttonFalseText: '失败'
            })
        ) {
            let fakeresult = {
                status: 'success'
            }
            params.success.apply(null, fakeresult)
        } else {
            let fakeresult = {
                status: 'fail'
            }
            params.fail.apply(null, fakeresult)
        }
    },
    scanQRCode(params) {
        params.success.apply(null, [
            {
                resultStr: '123,9787550294837'
            }
        ])
    },
	getLocation(options){
		options.success.apply(null, [
			{
				lat: '123,9787550294837',
				lng:'111'
			}
		])
	}
}

if (process.env.NODE_ENV === 'production') {
    Vue.prototype.$wx = wx
} else {
    Vue.prototype.$wx = FakeWechat
}

