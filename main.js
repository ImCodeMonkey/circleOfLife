import Vue from 'vue'
import App from './App'
import store from './store'
// ** 注册全局组件 ** //
//引入弹框组件
import neilModal from 'components/neil-modal.vue';
Vue.component('neil-modal',neilModal)
// ** 注册全局组件 ** //

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
