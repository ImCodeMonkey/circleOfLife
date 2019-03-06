import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let constants = require('common/constants.js');
let Session = require('common/session.js');

const store = new Vuex.Store({
	state: {
		localhost: constants.localhost,
		userInformation: Session.get() != null ? Session.get().data : {},
		copyright: 'Copyright@2019我们的生活圈子 All Rights Reserved 京ICP备17049136号-2'
	},
	mutations: {
		userInfoUpdate (state) {
			state.userInformation = Session.get() != null ? Session.get().data : {}
		}
	}
})

export default store