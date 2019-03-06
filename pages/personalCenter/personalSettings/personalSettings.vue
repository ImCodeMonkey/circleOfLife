<template>
	<view>
		<view class="list" v-for="(list,index) in menuList" :key="index">
			<view class="li" v-for="(li,li_i) in list" @tap="toPage(index,li_i)" v-bind:class="{'noborder':li_i==list.length-1}"  hover-class="hover" :key="li.name" >
				<view class="text">{{li.name}}</view>
			</view>
		</view>
		<!--S-询问是否退出应用-->
		<view class="m_loginOut">
			<neil-modal :show="loginOut.show" title="您确定要退出应用吗？" @confirm="confirmBtn()" @cancel="cancelBtn()">
			</neil-modal>
		</view>
		<!--E-询问是否退出应用-->
	</view>
	
</template>

<script>
	//获取session设置
	var Session = require('common/session');
	
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: {
			...mapState(['userInformation'])
		},
		data() {
			return {
				logonStatus: '',
				menuList:[
					[
						{name:'个人资料', type:'link', href:'/pages/personalCenter/menuList/personalData/personalData'},
						{name:'安全中心'},
						{name:'关于圈子', type:'link', href:'/pages/personalCenter/menuList/about/about'}
					],
					[
						// #ifdef APP-PLUS
						{name:'问题反馈', type:'link', href:'/pages/personalCenter/menuList/feedback/feedback'},
						// #endif
						{name:'退出应用', type:'loginOut'}
					]
				],
				"loginOut": {
					"show": false,
					"success": "操作成功"
				},
			};
		},
		methods: {
			//用户点击列表项
			toPage(list_i,li_i){
				if(this.menuList[list_i][li_i].type == 'loginOut'){
					//验证登录状态
					if(!this.logonStatus){
						uni.showToast({icon:'none',title: '您还没有登录哦'});
						return
					}
					this.loginOut.show = true;
				}else if(this.menuList[list_i][li_i].type == 'link'){
					uni.navigateTo({
						url: this.menuList[list_i][li_i].href
					});
				}else{
					uni.showToast({title: this.menuList[list_i][li_i].name});
				}
			},
			//点击确认按钮
			confirmBtn: function(){
				//清除本地信息
				Session.clear();
				//更新信息到全局
				this.$store.commit('userInfoUpdate');
				uni.showToast({title: this.loginOut.success});
				this.loginOut.show = false;
				//反回上一级页面
				uni.navigateBack({delta: 1});
			},
			//点击取消按钮
			cancelBtn: function(){
				this.loginOut.show = false;
			}
		},
		watch: {
			userInformation: function (newQuestion, oldQuestion) {
				this.logonStatus = newQuestion.skey?true:false
			}
		},
		onShow() {
			//更新vuex存储
			this.$store.commit('userInfoUpdate');
		}
	}
</script>

<style lang="scss">
.list{
	width:100%;
	border-bottom:solid 26upx #f1f1f1;
	
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:solid 1upx #e7e7e7;
		display:flex;
		align-items:center;
		
		&.noborder{
			border-bottom:0
		}
		
		.text{
			width:100%;
			color:#666;
			text-align: center
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx
		}
	}
}
</style>
