import engine from 'store'
import storages from 'store/storages/all'
import json2 from 'store/plugins/json2'
import expire from 'store/plugins/expire'
const plugins = [json2, expire]

export default engine.createStore(storages, plugins)
