// Styles - No longer needed if using SVG for tree-shaking
// import '@mdi/font/css/materialdesignicons.css'
import {
	mdiMusicNoteOutline,
	mdiMusicNoteOffOutline,
	mdiPlay,
	mdiPause,
	mdiStop,
	mdiThemeLightDark,
	mdiClose,
	mdiClockOutline,
	mdiInformationOutline,
	mdiDelete,
	mdiDeleteSweep,
	mdiCheck,
	mdiAlert,
	mdiChevronLeft,
	mdiChevronRight,
	mdiCheckboxMarked,
	mdiPhone,
	mdiCheckboxBlankOutline,
	mdiCheckboxIntermediate,
	mdiSort,
	mdiChevronDown,
	mdiChevronUp,
	mdiMenu,
	mdiFilterOutline,
	mdiRadioboxMarked,
	mdiRadioboxBlank,
	mdiPencil,
	mdiStarOutline,
	mdiStar,
	mdiStarHalfFull,
	mdiLoading,
	mdiEmoticonSadOutline,
	mdiPageFirst,
	mdiPageLast,
	mdiCubeUnfolded,
	mdiFile,
	mdiHome,
	mdiMagnify,
	mdiGift,
	mdiHomeAccount,
	mdiInbox,
	mdiPoll,
	mdiBookOpen,
	mdiApps,
	mdiWrenchOutline,
	mdiCopyright,
	mdiInformation,
	mdiAt,
	mdiClock,
	mdiLock,
	mdiCellphoneMessage,
	mdiCubeOutline,
	mdiRefresh,
	mdiLoginVariant,
	mdiLogoutVariant,
	mdiTag,
	mdiTagMultiple,
	mdiShoppingOutline,
	mdiShopping,
	mdiMinus,
	mdiPlus,
	mdiWallet,
	mdiSack,
	mdiTicket,
	mdiShare,
	mdiCommentProcessingOutline,
	mdiHeart,
	mdiHeartOutline,
	mdiThumbUp,
	mdiSend,
	mdiContacts,
	mdiCogs,
	mdiChat,
	mdiCheckboxMarkedCircle,
	mdiFingerprint,
	mdiLink,
	mdiLinkOff,
	mdiHistory,
	mdiImage,
	mdiPuzzle,
	mdiPalette,
	mdiTranslate,
	mdiCalendarToday,
	mdiFolderMultipleImage,
	mdiFlag,
	mdiStorefront,
	mdiCheckboxMarkedCircleOutline,
	mdiWechat,
	mdiApple,
	mdiGithub,
	mdiHeadQuestion,
	mdiBullseyeArrow,
	mdiAirplaneLanding,
	mdiAirplaneTakeoff,
	mdiBarcode,
	mdiShuffle,
	mdiMapMarker,
	mdiCommentEdit,
	mdiAccountOutline,
	mdiCashRegister,
	mdiNinja,
	mdiHeadset,
	mdiDirections,
	mdiWarehouse,
	mdiAccount,
	mdiCalendarClock,
	mdiCreditCard,
	mdiCoffee,
	mdiWalletPlus,
	mdiFolderHeartOutline,
	mdiHandHeart,
	mdiCreditCardOutline,
	mdiMail,
	mdiMessageText,
	mdiFolderAccountOutline,
	mdiTooltipImage,
	mdiShareVariant,
	mdiSinaWeibo,
	mdiTwitter,
	mdiFacebook,
	mdiInstagram,
	mdiGoogle,
	mdiBookshelf,
	mdiDotsHorizontal,
	mdiViewList,
	mdiAccountCircle,
	mdiCircleOutline,
	mdiTruck,
	mdiHomeSwitchOutline,
	mdiRunFast,
	mdiTruckFastOutline,
	mdiMapMarkerCircle,
	mdiMapSearch,
	mdiQrcode,
	mdiQrcodeScan,
	mdiVolumeHigh
} from '@mdi/js'
import { createVuetify } from 'vuetify'
//使用mdi-svg - 可以tree shake

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
//如果直接用 icon=mdi-xxx
import { aliases as mdiSvgAliases, mdi as mdiSvg } from 'vuetify/iconsets/mdi-svg'
import * as labs from 'vuetify/labs/components'
//mdi-前缀

import 'vuetify/styles'

const customIcons = {
	truck: mdiTruck,
	accountPay: mdiAccountCircle,
	wechatmoments: mdiShareVariant,
	weibo: mdiSinaWeibo,
	douban: mdiBookshelf,
	twitter: mdiTwitter,
	facebook: mdiFacebook,
	instagram: mdiInstagram,
	google: mdiGoogle,
	sharePic: mdiTooltipImage,
	mail: mdiMail,
	sms: mdiMessageText,
	history: mdiHistory,
	image: mdiImage,
	puzzle: mdiPuzzle,
	palette: mdiPalette,
	translate: mdiTranslate,
	topup: mdiWalletPlus,
	shopOrder: mdiCoffee,
	cartOrder: mdiCreditCard,
	favorite: mdiFolderHeartOutline,
	promote: mdiHandHeart,
	calendarToday: mdiCalendarToday,
	clock: mdiClockOutline,
	link: mdiLink,
	linkOff: mdiLinkOff,
	complete: '...',
	homeSwitch: mdiHomeSwitchOutline,
	github: mdiGithub,
	cancel: mdiClose, //'mdi-close', //v-alert dismissble
	wait: mdiClockOutline, //'mdi-clock-outline',
	close: mdiClose, //'mdi-close',
	delete: mdiDelete, //'mdi-delete', // delete (e.g. v-chip close)
	clear: mdiDeleteSweep, //'mdi-delete-sweep',
	success: mdiCheck, //'mdi-check',
	check: mdiCheck, //'mdi-check',
	circleOutline: mdiCircleOutline,
	checkboxMarkedCircle: mdiCheckboxMarkedCircle, //pay/cashier
	info: mdiInformationOutline, //'mdi-information-outline',
	warning: mdiAlert, //'mdi-alert',
	error: mdiClose, //'mdi-close',
	fingerprint: mdiFingerprint,
	prev: mdiChevronLeft, //'mdi-chevron-left',
	next: mdiChevronRight, //'mdi-chevron-right',
	checkboxOn: mdiCheckboxMarked, //'mdi-checkbox-marked',
	checkboxOff: mdiCheckboxBlankOutline, //'mdi-checkbox-blank-outline',
	checkboxIndeterminate: mdiCheckboxIntermediate, //'mdi-checkbox-intermediate',
	delimiter: '...', // for carousel
	sort: mdiSort, //'mdi-sort',
	expand: mdiChevronDown, // 'mdi-chevron-down', //member/center
	collapse: mdiChevronUp, //'mdi-chevron-up', //order/list
	menu: mdiMenu, // 'mdi-menu',
	filter: mdiFilterOutline, //'mdi-filter-outline',
	subgroup: '...',
	dropdown: mdiChevronDown, //'mdi-chevron-down',
	radioOn: mdiRadioboxMarked, //'mdi-radiobox-marked',
	radioOff: mdiRadioboxBlank, // 'mdi-radiobox-blank',
	edit: mdiPencil, //'mdi-pencil',
	ratingEmpty: mdiStarOutline, // 'mdi-star-outline', //itemdetail
	ratingFull: mdiStar, //'mdi-star',
	ratingHalf: mdiStarHalfFull, //'mdi-star-half-full',
	loading: mdiLoading, //'loading',
	more: mdiDotsHorizontal,
	nomore: mdiEmoticonSadOutline, //'mdi-emoticon-sad-outline',
	first: mdiPageFirst, // 'mdi-page-first',
	last: mdiPageLast, //'mdi-page-last',
	unfold: mdiCubeUnfolded, //'mdi-unfold',
	file: mdiFile, // 'mdi-file',
	home: mdiHome, // 'mdi-home',
	creditCard: mdiCreditCardOutline,
	search: mdiMagnify, //'mdi-magnify',
	giftCenter: mdiGift, // 'mdi-gift',
	reserve: mdiHomeAccount, //'mdi-home-account',
	taskCenter: mdiCheckboxMarkedCircleOutline,
	inbox: mdiInbox, //'mdi-inbox',
	collection: mdiFolderMultipleImage,
	store: mdiStorefront,
	flag: mdiFlag,
	poll: mdiPoll, //'mdi-poll',
	bookShelf: mdiBookOpen, //'mdi-book-open',
	apps: mdiApps, // 'mdi-apps',
	setting: mdiWrenchOutline, // 'mdi-wrench-outline',
	aboutUs: mdiCopyright, //'mdi-copyright',
	contactUs: mdiInformation, //'mdi-information',
	email: mdiAt, //'mdi-at',
	phone: mdiPhone, //'mdi-phone',
	password: mdiLock, //'mdi-lock',
	passcode: mdiCellphoneMessage, //'mdi-cellphone-message', //mdi-phone-message
	captcha: mdiCubeOutline, //'mdi-cube-outline',
	reload: mdiRefresh, //'mdi-refresh',
	login: mdiLoginVariant, //'mdi-login-variant',
	logout: mdiLogoutVariant, //'mdi-logout-variant',
	tag: mdiTag, //'mdi-tag',
	tags: mdiTagMultiple, // 'mdi-tag-multiple',
	left: mdiChevronLeft, //'mdi-chevron-left',
	right: mdiChevronRight, //'mdi-chevron-right',
	up: mdiChevronUp, //'mdi-chevron-up',
	down: mdiChevronDown, // 'mdi-chevron-down',
	cart: mdiShoppingOutline, // 'mdi-shopping-outline', //'mdi-cart',
	cartPlus: mdiShopping, //'mdi-shopping', //'mdi-cart-arrow-down',//'mdi-cart-plus',
	minus: mdiMinus, //'mdi-minus',
	plus: mdiPlus, //'mdi-plus',
	member: mdiAccount,
	myorders: mdiCalendarClock,
	memberInfo: mdiFolderAccountOutline,
	memberOutline: mdiAccountOutline, //'mdi-account-outline',
	musicPlay: mdiMusicNoteOutline, //'mdi-music-note-outline',
	musicPause: mdiPause, // 'mdi-pause',
	accountBalance: mdiWallet, //'mdi-wallet',
	creditBalance: mdiSack, //'mdi-sack',
	voucher: mdiTicket, //'mdi-ticket',
	share: mdiShare, //'mdi-share',
	comment: mdiCommentProcessingOutline, //'mdi-comment-processing-outline',
	favoriteOn: mdiHeart, //'mdi-heart',
	favoriteOff: mdiHeartOutline, //'mdi-heart-outline',
	rateUs: mdiThumbUp, //'mdi-thumb-up',
	send: mdiSend, //'mdi-send',
	contacts: mdiContacts, // 'mdi-contacts',
	settings: mdiCogs, // 'mdi-cogs',
	chat: mdiChat, // 'mdi-chat',
	wechat: mdiWechat,
	apple: mdiApple,
	checkinDate: mdiAirplaneLanding,
	checkoutDate: mdiAirplaneTakeoff,
	barcode: mdiBarcode,
	random: mdiShuffle,
	mapMarker: mdiMapMarker,
	directions: mdiDirections,
	cashier: mdiCashRegister,
	feedback: mdiCommentEdit,
	staff: mdiNinja,
	howto: mdiHeadQuestion,
	game: mdiBullseyeArrow,
	customerService: mdiHeadset,
	theme: mdiThemeLightDark,
	warehouse: mdiWarehouse,
	list: mdiViewList,
	selfPick: mdiRunFast,
	express: mdiTruckFastOutline,
	mapSearch: mdiMapSearch,
	qr: mdiQrcode,
	qrcode: mdiQrcode,
	scanQr: mdiQrcodeScan,
	notice: mdiVolumeHigh
}
const icons = {
	defaultSet: 'mdiSvg', // 'mdi' || 'mdiSvg'
	sets: {
		mdiSvg
		// customIcons
		// mdiSvg
	},
	aliases: {
		// ...mdiAliases, // Vuetify 默认别名（包含 plus）
		...mdiSvgAliases,
		...customIcons // 自定义别名（包含 reload）- 放在最后确保优先级
	}
}

const vuetify = createVuetify({
	components: {
		...components,
		...labs
	},
	directives,
	icons,
	// icons: {
	// 	iconfont: 'md' || 'mdi',
	// 	values: customIcons
	// },
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
