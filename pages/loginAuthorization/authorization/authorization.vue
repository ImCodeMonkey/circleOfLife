<template>
	<view class="content">
		<view class="oauth-row">
			<view class="uni-flex uni-column">
				<view class="flex-item flex-item-V uni-center uni-word">
					<text class="uni-h4">
						尊敬的用户您好，本程序用户信息依赖微信用户信息，请允许使用微信授权，否则应用无法记录您的个人信息。
					</text>
				</view>
				<view class="flex-item flex-item-V form_box">
					<view class="uni-btn-v">
						<button type="primary" :open-type="openType" @tap="oauth()" :app-parameter="weixin" v-show="!authorization.show">
							{{authorization.text}}
						</button>
					</view>
				</view>
				<view class="flex-item flex-item-V uni-center uni-h6">
					{{copyright}}
				</view>
			</view>
		</view>
		<!--S-对app进行登录授权操作-->
		<view class="m_authorization">
			<neil-modal :show="authorization.show" title="请点击授权按钮授权" @confirm="confirmBtn()" @cancel="cancelBtn()">
			</neil-modal>
		</view>
		<!--E-对app进行登录授权操作-->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	
	export default {
		data() {
			return {
				"providerList": [],	//服务商信息
				"authorization": {
					"show": true,
					"text": "点击按钮进行授权"
				},
				"weixin": "",
				"openType": "getUserInfo"
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
			oauth: function() {
				var _this = this;
				var value = _this.providerList[0].value;
				_this.authorization.text = "授权中，请稍后...";
				uni.login({
				    provider: value,
				    success: (res) => {
						//成功后获取用户详细信息
						uni.getUserInfo({
						    provider: value,
							withCredentials: true,
						    success: (infoRes) => {
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
										res.data.success = true;
										_this.weixin = JSON.stringify(res);
										_this.openType = "launchApp";
										_this.authorization.text = "授权成功，点击跳转至app端";
									},
									fail: (err) => {
										console.error('获取唯一标识失败：' + JSON.stringify(err));
									},
									complete: () => {}
								});
						    },
							fail: (err) => {
								console.error(JSON.stringify(err));
							},
						});
				    },
				    fail: (err) => {
				        console.error('授权登录失败：' + JSON.stringify(err));
				    }
				});
			},
			//点击确认按钮
			confirmBtn: function(){
				console.log('点击了确认按钮');
				this.authorization.show = false;
			},
			//点击取消按钮
			cancelBtn: function(){
				this.authorization.show = false;
				this.openType = "launchApp";
				this.authorization.text = "授权失败，点击跳转至app端";
				this.weixin = '{"success":false}';
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
