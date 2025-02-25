import colors from 'vuetify/lib/util/colors'
//默认的额主题配色
export default {
	//https://next.vuetifyjs.com/en/styles/colors/
	//https://theme-generator.vuetifyjs.com/
	light:{
		primary: '#FED049', //莫蓝迪绿
		secondary: '#3D5656' ,//黑色 colors.teal.base,
		accent: '#7e121f', //猩红
		error: '#AF2045',// 暗红 colors.red.base,
		warning: '#CFFDE1', //土黄 colors.amber.base,
		info: '#68B984',
		success: colors.green.base,
		silent: colors.grey.base,

		// 另一种格式
		// primary: {
		//     base: '#7a8a70',//'#7e121f', //maroon
		//     darken1: colors.purple.darken2,
		// },

		// Here we add a custom `tertiary` color
		// tertiary: colors.pink.base,
		background: '#e1e4de' //浅绿
	}, 
	dark:{
		background: '#333'
	}
}
