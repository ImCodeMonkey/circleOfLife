<template>
	<view class="content">
		<view class="oauth-row">
			<!-- #ifdef MP-WEIXIN -->
			<view class="uni-flex uni-column">
				<view class="flex-item flex-item-V uni-center">
					微信小程序登录窗口
				</view>
				<view class="flex-item flex-item-V form_box">
					<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
						<button type="primary" open-type="getUserInfo" @tap="oauth(provider.value)">{{loginMessage}}</button>
					</view>
				</view>
				<view class="flex-item flex-item-V uni-center">
					{{copyright}}
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="uni-flex uni-column">
				<view class="flex-item flex-item-V uni-center uni-word">
					<text class="uni-h4">
						尊敬的用户您好，本程序用户信息依赖微信用户信息，登录请点击下方按钮跳转至微信小程序进行授权。我们承诺不会对外泄露任何您的个人信息。
					</text>
				</view>
				<view class="flex-item flex-item-V form_box">
					<view class="uni-btn-v">
						<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
							<button type="primary" formType="submit" open-type="getUserInfo" @tap="APPoauth(provider.value)">跳转至小程序授权登录</button>
						</view>
					</view>
				</view>
				<view class="flex-item flex-item-V uni-center uni-h6">
					{{copyright}}
				</view>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	
	//获取微信服务端请求头常量
	var constants = require('common/constants');
	//获取session设置
	var Session = require('common/session');
	
	import {
		mapState
	} from 'vuex';
	
	export default {
		data() {
			return {
				"providerList": [],	//服务商信息
				"hasProvider": false,	//是否显示登录按钮
				"weixin": "",
				"app": "",
				"loginMessage": "授权登录"
			};
		},
		computed: {
			...mapState(['localhost','copyright'])
		},
		methods: {
			//获取服务商信息
			getProvider: function() {
				var _this = this;
				const filters = ['weixin'];
				//获取服务供应商
				uni.getProvider({
					service: 'oauth',
					success: function (res) {
						if (res.provider && res.provider.length) {
						    for (let i = 0; i < res.provider.length; i++) {
						        if (~filters.indexOf(res.provider[i])) {
						            _this.providerList.push({
						                value: res.provider[i]
						            });
						        }
						    }
						    _this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			//授权登录
			oauth: function(value) {
				var _this = this;
				_this.loginMessage = "授权中请稍后..."
				uni.login({
				    provider: value,
				    success: (res) => {
						//成功后获取用户详细信息
						uni.getUserInfo({
						    provider: value,
							withCredentials: true,
						    success: (infoRes) => {
								//app端可以直接获取openid
								_this.app = JSON.stringify(infoRes);
								
								// #ifdef MP-WEIXIN
								//换取openId（小程序端需要换取）
								uni.request({
									url: this.localhost + '/login',
									method: 'get',
									header: {//自定义请求头信息
										"x-wx-code": res.code,
										"x-wx-iv": infoRes.iv,
										"x-wx-encrypted-data": infoRes.encryptedData
									},
									success: res => {
										if(res.data.code != -1){
											_this.loginMessage = "授权登录成功"
											// 成功地响应会话信息
											//处理信息格式
											let skey = res.data.data.skey;
											let userInfo = res.data.data.userinfo;
											res.data.data = userInfo;
											res.data.data.skey = skey;
											Session.set(res.data);
											this.$store.commit('userInfoUpdate');
											_this.weixin = JSON.stringify(res);
											uni.showToast({
												title: '登录成功',
												complete() {
													setTimeout(function(){
														uni.hideToast();
														//反回上一级页面
														uni.navigateBack({delta: 1});
													},1000)
												}
											});
										}else{
											Session.clear();
											this.$store.commit('userInfoUpdate');
											uni.showToast({
												title: '登录失败，请重新授权登录',
												icon: 'none',
												complete() {
													setTimeout(function(){
														uni.hideToast();
													},1000)
												}
											});
										}
									}
								});
								// #endif
						    }
						});
				    },
				    fail: (err) => {
				        console.error('授权登录失败：' + JSON.stringify(err));
				    }
				});
			},
			//跳转至小程序授权
			APPoauth: function(value){
				var shares, sweixin;
				plus.share.getServices(function(s){
					shares={};
					for(var i in s){
						var t=s[i];
						shares[t.id]=t;
					}
					sweixin=shares['weixin'];
					sweixin.launchMiniProgram({
						id:'gh_54eed1071805',	//微信小程序原始id
						path: 'pages/loginAuthorization/authorization/authorization',	//跳转至app授权页面
						type: '2'
					},function(object){
						console.info(JSON.stringify(object))
					})
				}, function(e){
					console.info(e)
				});
			}
		},
		onLoad() {
			//页面加载完毕后执行
			//更新vuex存储
			this.$store.commit('userInfoUpdate');
			//获取服务商信息
		    this.getProvider();
		}
	}
</script>

<style lang="scss">
.oauth-row{
	background: $uni-bg-color;
	
	.form_box{
		padding: 0 $uni-spacing-row-base;
	}
}
</style>

