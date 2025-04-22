// Plugins
// import Layouts from 'vite-plugin-vue-layouts'
import * as Sentry from '@sentry/cli'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Fonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
// Utilities
import { defineConfig } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const release = `nosoadmin@${process.env.npm_package_version}`

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		visualizer({
			open: true, // 打包完成后自动打开分析报告
			filename: 'stats.html' // 生成的报告文件名
		}),
		VueRouter(),
		// Layouts(),
		Vue({
			template: { transformAssetUrls }
		}),
		// https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
		Vuetify({
			autoImport: true,
			styles: {
				configFile: 'src/styles/settings.scss'
			}
		}),
		Components(),
		Fonts({
			google: {
				families: [
					{
						name: 'Roboto',
						styles: 'wght@100;300;400;500;700;900'
					}
				]
			}
		}),
		AutoImport({
			imports: ['vue', 'vue-router'],
			eslintrc: {
				enabled: true
			},
			vueTemplate: true
		})
	],
	define: { 'process.env': {}, __SENTRY_RELEASE__: JSON.stringify(release) },
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@ui': 'noso-ui',
			// '@utils': 'noso-utils'
			'@utils': fileURLToPath(new URL('./src/utils', import.meta.url)) // Ensure this path is correct
		},
		extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
	},
	server: {
		port: 3000
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					// 将 Vue 和 Vue Router 分离到单独的 chunk 中
					vue: ['vue', 'vue-router', 'vue-i18n', 'pinia'],
					// 将其他第三方库分离
					vendor: ['axios', 'lodash-es'],
					echart: ['echarts'],
					html5qrcode: ['html5-qrcode'],
					html2canvas: ['html2canvas'],
					vuetify: ['vuetify/components'],
					mdi: ['@mdi/js'],
					validator: ['validator'],
					appui: ['@ui']
				}
			}
		}
	}
})
