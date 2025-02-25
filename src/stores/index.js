// Utilities

import { useRootStore } from './root'
import { useVisitorStore } from './visitor'
export default function registerStores() {
	return {
		root: useRootStore(),
		visitor: useVisitorStore()
	}
}
