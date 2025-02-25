const soul = {
	// logo:require('@/assets/logo/black-bg-round.png'),
	publicLogo: process.env.VUE_APP_DOMAIN + '/static/img/logo.png', //app分享出去
	title: 'noso roasters',
	salt: '', //加密盐
	checkForUpdates: 1, //版本检查间隔时间（分钟），false - 不检查
	//用于跳转到前端详情页时（如商品、券）
	frontEndHost:
		process.env.NODE_ENV === 'production'
			? 'https://nosoadmin.hahacking.com'
			: 'http://localhost:3000',
	backEndHost:
		process.env.NODE_ENV === 'production'
			? 'https://nosoapi.hahacking.com'
			: 'http://devnosoapi.hahacking.com',
	menu: [
		{
			title: '订单',
			icon: 'mdi:cash-register',
			to: '/order'
		},
		{
			title: '生豆',
			icon: 'ph:coffee-bean-bold',
			color: 'green',
			to: '/bean/manage'
		},
		{
			title: '烘焙',
			icon: 'ph:coffee-bean-fill',
			color: 'brown',
			to: '/roast/manage'
		},
		{
			title: '杯测',
			icon: 'mdi-cup',
			to: '/cupping/manage'
		},
		{
			title: '数据',
			icon: 'mdi-google-analytics',
			to: '/report',
			items: [
				{
					title: '报表',
					icon: 'mdi-table-large',
					to: '/report/manage'
				},
				{
					title: '图表',
					icon: 'mdi-chart-areaspline',
					to: '/report/chartmanage'
				},
				{
					title: '指标',
					icon: 'mdi-telescope',
					to: '/report/polaris'
				}
				// { title: '洞察', icon: 'mdi-bullseye', to: '/report/polaris' },
			]
		},
		{
			title: '权限',
			icon: 'mdi-account-lock',
			to: '/acl',
			items: [
				{
					title: '用户',
					icon: 'mdi-account',
					to: '/acl/usermanage'
				},
				{
					title: '角色',
					icon: 'mdi-account-tie',
					to: '/acl/rolemanage'
				},
				{
					title: '用户组',
					icon: 'mdi-account-multiple-check',
					to: '/acl/groupmanage'
				},
				{
					title: '资源',
					icon: 'mdi-book-account',
					to: '/acl/resourcemanage'
				}
			]
		},
		{
			title: '配置',
			icon: 'mdi-cogs',
			to: '/setting',
			items: [
				{
					title: '通用',
					icon: 'mdi-table-large',
					to: '/setting/common'
				},
				{
					title: 'API参数',
					icon: 'mdi-wechat',
					to: '/setting/api'
				},
				{
					title: '支付参数',
					icon: 'mdi-piggy-bank-outline',
					to: '/setting/payment'
				},
				{
					title: '公众号菜单',
					icon: 'mdi-menu',
					to: '/setting/wechatmenu'
				}
			]
		},
		{
			title: '工具',
			icon: 'mdi-tools',
			to: '/tool',
			items: [
				{
					title: '图片上传',
					icon: 'mdi-image',
					to: '/tool/upload'
				},
				{
					title: '文件上传',
					icon: 'mdi-upload-multiple',
					to: '/tool/uploadfile'
				},
				{
					title: '二维码生成',
					icon: 'mdi-qrcode',
					to: '/tool/qrcode'
				},
				{
					title: '小程序码生成',
					icon: 'mdi-wechat',
					to: '/tool/wechatappcode'
				},
				{
					title: '短链接生成',
					icon: 'mdi-feather',
					to: '/tool/shorturl'
				},
				{
					title: '咖啡标签',
					icon: 'mdi-coffee',
					to: '/tool/coffeetag'
				}
			]
		}
		// {title:'系统',icon:'mdi-desktop-mac-dashboard',items:[
		// 		{ title: '错误日志', icon: 'mdi-file-tree', to: '/system/errorlog' },
		// 		{ title: '队列日志', icon: 'mdi-image-area', to: '/system/queuelog'},
		// 	]}	,
	],
	login: {
		wechat: true,
		apple: true,
		github: true,
		instagram: false,
		google: true,
		facebook: true
	}
}

export default soul
