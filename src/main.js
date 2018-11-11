import Vue from 'vue'
import App from './App.vue'
import VueUi from '@vue/ui'
import router from './router'
import store from './store'
import VueTypedJs from 'vue-typed-js'
import '@vue/ui/dist/vue-ui.css'
import Copy from 'v-copy'

Vue.use(Copy)
Vue.use(VueUi)
Vue.use(VueTypedJs)
Vue.config.productionTip = false
Vue.prototype.$alert = function (title,content) {
      store.commit('showAlert', {title:title,content:content})
}

new Vue({
  router,
  store,
  ...App,
}).$mount('#app')