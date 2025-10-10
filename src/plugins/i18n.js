import commonLocaleMessages from '@ui/i18n'
import { loadLocale } from '@utils/utils/cache'
import { clone, merge } from 'lodash-es'
import { createI18n } from 'vue-i18n'

const loadLocaleMessages = () => {
	const files = import.meta.glob('../locales/*.json', { eager: true })
	const messages = clone(commonLocaleMessages)
	// console.log("message", messages);
	const keys = Object.keys(files)
	// 执行批量替换操作
	for (let key of keys) {
		const matched = key.match(/([A-Za-z0-9-_]+)\./i)
		if (matched && matched.length > 1) {
			const locale = matched[1]
			messages[locale] = files[key]
		}
	}
	return messages
}

let locale = loadLocale()
const messages = loadLocaleMessages()

const i18n = createI18n({
	legacy: false,
	locale: locale ? locale : 'zhHans',
	fallbackLocale: 'zhHans',
	messages,
	allowComposition: true, // you need to specify that!
	globalInjection: true
})

export default i18n
