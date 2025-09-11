/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */
// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

// import { setupLayouts } from 'virtual:generated-layouts'

const defaultLayoutComponent = () => import('../layouts/default.vue')

// Use Vite's glob import feature to import all Vue files from the pages directory
const pageComponents = import.meta.glob('../pages/**/*.vue')

// Function to transform file paths into route paths
const pathFromFilePath = (filePath) => {
	const path = filePath
		.replace('../pages', '') // Remove the directory part
		.replace('.vue', '') // Remove the file extension
		.replace('/index', '') // Treat index.vue as the root of the folder
	return path === '' ? '/' : path // Ensure the root path is correctly set
}

// Generate routes from imported components
const routes = Object.keys(pageComponents).map((filePath) => {
	const path = pathFromFilePath(filePath)

	return {
		path: path.toLowerCase(),
		component: defaultLayoutComponent,
		children: [
			{
				// Use an empty path for the child route to directly render it in the default layout
				path: '',
				component: pageComponents[filePath] // Lazy-load the page component
			}
		]
	}
})

// Add 404 route at the end
routes.push({
	path: '/:pathMatch(.*)*',
	component: defaultLayoutComponent,
	children: [
		{
			path: '',
			component: () => import('../pages/404.vue')
		}
	]
})

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	// extendRoutes: setupLayouts,
	routes
})
router.beforeEach((to, from, next) => {
	// console.log('beforeEach', to, from)
	next()
})

export default router
