import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './assets/tailwind.css'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
Vue.use(VueClipboard)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created: () => (document.documentElement.setAttribute('lang', 'ja'))
}).$mount('#app')
