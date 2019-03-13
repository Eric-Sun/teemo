import Vue from 'vue'
import App from './App'
import Flyio from 'flyio/dist/npm/wx'

Vue.prototype.$http = new Flyio()
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
