import Vue from 'vue'
import App from './App.vue'
import store from './store'
import socket from '@/socket';

Vue.config.productionTip = false

Vue.prototype.$socket = socket

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
