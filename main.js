import App from './App'
import share from 'static/share.js'
import en from './locale/en.json'
import zhHans from './locale/zh-Hans.json'
const messages = {
	en,
	'zh-Hans': zhHans,
}

let i18nConfig = {
  locale: uni.getLocale(),// 获取已设置的语言
  messages
}

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
Vue.mixin(share)


import VueI18n from 'vue-i18n'// v8.x
// import messages from 'locale/index.js'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.prototype._i18n = i18n

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
    ...App,
	share
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'// v9.x
const i18n = createI18n(i18nConfig)
export function createApp() {
  const app = createSSRApp(App)
  app.use(i18n)
  return {
    app
  }
}
// #endif

