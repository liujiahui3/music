import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import 'animate.css/animate.css'
import store from './store'
import MINTUI from 'mint-ui'
import 'mint-ui/lib/style.min.css'
// import vConsole from 'vconsole'
// Vue.prototype.$vConsole = new vConsole()
Vue.use(MINTUI)

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/favicon.ico',
  loading: '/favicon.ico',
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
