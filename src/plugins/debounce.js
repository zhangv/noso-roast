export default {
	install(app) {
		app.directive('debounce', {
			mounted(el, binding) {
				if (el.tagName !== 'BUTTON' && !el.classList.contains('v-btn')) {
					return
				}

				const delay = binding.value || 300
				let timeoutId

				const clickHandler = el.onclick
				if (clickHandler) {
					el.onclick = function (...args) {
						if (timeoutId) {
							clearTimeout(timeoutId)
						}

						timeoutId = setTimeout(() => {
							clickHandler.apply(this, args)
							timeoutId = null
						}, delay)
					}
				}
			}
		})
	}
}
