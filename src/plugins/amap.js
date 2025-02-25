//注意：不能在main中import的方式初始化，会报错：Uncaught (in promise) TypeError: v.w.uh is not a constructor

import * as Vue from 'vue';
import VueAMap from 'vue-amap';
// Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
	key: process.env.VUE_APP_AMAP_KEY,
	plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
	v: '1.4.4'
});

