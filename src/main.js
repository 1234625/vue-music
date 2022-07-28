import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLazyload)

const loadimage = require('./common/image/default.png')
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: loadimage,
  attempt: 1
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
