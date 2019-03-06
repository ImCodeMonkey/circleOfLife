var Session = require('./session');
var constants = require('./constants');
import store from 'store'

const loginStatus = {
	//登录态校验
	verifyLoginStatus: function(){
		var session = Session.get();
		//登录态验证
		uni.request({
			url: constants.localhost + '/user',
			method: 'get',
			header: {//自定义请求头信息
				"x-wx-skey": session.data.skey
			},
			success: res => {
				if(res.data.code != -1){
					//更新用户登录态信息
					res.data.data.skey = session.data.skey;
					Session.set(res.data);
					store.commit('userInfoUpdate')
					console.info('登录态更新完成')
				}else{
					Session.clear()
					store.commit('userInfoUpdate')
					console.info('鉴权失败，清除用户登录信息')
				}
			}
		});
	},
	overdue: function(){
		// #ifdef APP-PLUS
		let argumentsData = JSON.parse(plus.runtime.arguments);
		console.info(JSON.stringify(argumentsData))
		if(typeof(argumentsData.data) != 'undefined' && argumentsData.data.success != null){
			//存储登录态
			let skey = argumentsData.data.data.skey;
			let userInfo = argumentsData.data.data.userinfo;
			argumentsData.data.data = userInfo;
			argumentsData.data.data.skey = skey;
			console.info(JSON.stringify(argumentsData))
			Session.set(argumentsData.data);
			store.commit('userInfoUpdate')
			console.log('登录态存储成功')
			//反回上一级页面
			uni.navigateBack({delta: 1});
		}else if(argumentsData.success == false){
			//清空session
			Session.clear();
			store.commit('userInfoUpdate');
			//反回上一级页面
			uni.navigateBack({delta: 1});
		}
		// #endif
		
		var session = Session.get();
		//当前有登录态的时候执行
		if(session != null){
			let time = session.data.watermark.timestamp;
			if(parseInt((new Date()).valueOf()/1000) - 60*60*24 > time){
				//清空session
				Session.clear()
				store.commit('userInfoUpdate')
			}else{
				//更新登录态
				this.verifyLoginStatus()
			}
		}
	}
}

//登录态验证
export default loginStatus
