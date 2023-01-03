import App from './App'
import MockData from './static/MockData' //测试用数据

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
const mock = type => {
	// 模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(MockData[type]);
		}, 500)
	})
}
Vue.prototype.$api = {
	mock
}
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

import uView from 'uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'
