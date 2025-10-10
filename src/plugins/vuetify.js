// Styles - 使用 SVG 图标，不需要引入字体文件
import '@mdi/font/css/materialdesignicons.css'
import MY_ICONS from '@ui/icons.js'
import { createVuetify } from 'vuetify'
//使用mdi-svg - 可以tree shake

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
//如果直接用 icon=mdi-xxx
import { aliases as mdiSvgAliases, mdi as mdiSvg } from 'vuetify/iconsets/mdi-svg'
import * as labs from 'vuetify/labs/components'
import 'vuetify/styles'

const icons = {
	defaultSet: 'mdiSvg' || 'mdi', // 使用 mdi 字体作为默认集
	sets: {
		mdi,
		mdiSvg
	},
	aliases: {
		...mdiAliases, // Vuetify 默认别名
		...MY_ICONS, // 自定义别名
		...mdiSvgAliases // mdiSvg 别名
	}
}

const vuetify = createVuetify({
	components: {
		...components,
		...labs
	},
	directives,
	icons,
	defaults: {
		//覆盖组件的属性默认值
		global: {
			ripple: true,
			density: 'comfortable'
		},
		VSheet: {
			elevation: 4
		},
		VTable: {
			hover: true
		},
		VDataTable: {
			hover: true
		},
		VDataTableServer: {
			hover: true,
			itemsPerPageOptions: [5, 10, 20, 30, 50, 100]
		},
		VRadioGroup: {
			hideDetails: 'auto'
		},
		VInput: {
			hideDetails: 'auto'
		}
	},
	theme: {
		// defaultTheme: 'myCustomTheme',
		// variations: {
		// 	colors: ['primary', 'secondary'],
		// 	lighten: 1,
		// 	darken: 2
		// },
		themes: {
			// light: {
			// 	// dark: false,
			// 	colors: {
			// 		primary: '#91B493', // You can change this to any color you prefer
			// 		secondary: '#424242',
			// 		accent: '#82B1FF',
			// 		error: '#FF5252',
			// 		info: '#2196F3',
			// 		success: '#4CAF50',
			// 		warning: '#FFC107'
			// 	}
			// },
			// dark: {
			// 	dark: true,
			// 	colors: {
			// 		primary: '#1976D2', // You can change this to any color you prefer
			// 		secondary: '#424242',
			// 		accent: '#82B1FF',
			// 		error: '#FF5252',
			// 		info: '#2196F3',
			// 		success: '#4CAF50',
			// 		warning: '#FFC107'
			// 	}
			// }
		}
	}
}) // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

export default vuetify
