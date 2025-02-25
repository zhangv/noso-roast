// const engine = require('store/src/store-engine')
import engine from 'store'
// const storages = require('store/storages/all')
import storages from 'store/storages/all'
import json2 from 'store/plugins/json2'
import expire from 'store/plugins/expire'
const plugins = [
	// require('store/plugins/json2'),
	// require('store/plugins/expire')
	json2,expire
]

// module.exports = engine.createStore(storages, plugins)
export default engine.createStore(storages, plugins)