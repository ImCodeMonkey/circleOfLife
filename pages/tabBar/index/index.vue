<template>
	<view class="index">
		<view class="content">
			<!--S-头部banner-->
			<lidada-swiper :listData="banner" :jump="false" :statusBarHeight="true" :autoplay="true">
			</lidada-swiper>
			<!--E-头部banner-->
			<!--S-宫格-->
			<uni-grid @click="bindClick" :data="grid" :type="oblong" :column-num="5" :show-out-border="false" :show-border="false">
			</uni-grid>
			<!--E-宫格-->
			<!--S-推荐模块 4个-->
			<view class="m_cardImg">
				<image @tap="cardClick" :data-href="1234" src="../../../static/card_img.jpg" mode=""></image>
				<image @tap="cardClick" :data-href="2134" src="../../../static/card_img.jpg" mode=""></image>
				<image @tap="cardClick" :data-href="1234" src="../../../static/card_img.jpg" mode=""></image>
				<image @tap="cardClick" :data-href="56554" src="../../../static/card_img.jpg" mode=""></image>
			</view>
			<!--E-推荐模块 4个-->
		</view>
	</view>
</template>

<script>
	
	//引入lidada-swiper组件
	import lidadaSwiper from '../../../components/lidada_swiper.vue'
	//引入uniGrid九宫格组件
	import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue'
	
	import {
		mapState
	} from 'vuex';
	
	export default {
		components: {	//注册或获取全局组件
			lidadaSwiper,
			uniGrid
		},
		data() {
			return {
				"banner": [],	//banner数据容器
				"grid": [],	//宫格导航数据容器
			};
		},
		onLoad() {	//监听页面加载
			//更新vuex存储
			this.$store.commit('userInfoUpdate');
			//开启下拉监听功能
			uni.startPullDownRefresh();
		},
		computed: {
			...mapState(['localhost','userInformation'])
		},
		onShow() {
			//更新vuex存储
			this.$store.commit('userInfoUpdate');
			//显示用户信息
			console.info(JSON.stringify(this.userInformation))
		},
		methods: {	//事件处理器
			bindClick(e) {
				let href = this.grid[e.index].href;
				if(href){
					uni.navigateTo({
						url: href
					});
				}else{
					uni.showToast({ title: '功能开发中...', icon: "none" });
				}
			},
			cardClick(e) {
				console.log(e);
				console.log(e.currentTarget.dataset.href);
// 				let href = this.grid[e.index].href;
// 				if(href){
// 					uni.navigateTo({
// 						url: href
// 					});
// 				}else{
					uni.showToast({ title: '功能开发中...', icon: "none" });
				// }
			}
		},
		onPullDownRefresh() {	//下拉更新功能模块
			//页面加载提示信息
			uni.showLoading({
				title: '加载中请稍后...'
			});
			//加载banner
			uni.request({
				url: this.localhost + '/indexBanner',
				method: 'POST',
				success: res => {
					var data = res.data.data;
					let dataLength = data.length;
					//存储状态
					this.indicatorDots = dataLength > 1 ? true : false;
					this.banner = data;
					console.log('请求完成')
				},
				fail: () => {},
				complete: () => {
					setTimeout(function () {
						uni.hideLoading();	//隐藏加载提示
						uni.stopPullDownRefresh();	//隐藏下拉提示
					}, 1000);
				}
			});
			
			//加载宫格部分
			uni.request({
				url: this.localhost + '/indexGrid',
				method: 'POST',
				success: res => {
					var data = res.data.data;
					this.grid = data;
				},
				fail: () => {},
				complete: () => {
					setTimeout(function () {
						uni.hideLoading();	//隐藏加载提示
						uni.stopPullDownRefresh();	//隐藏下拉提示
					}, 1000);
				}
			});
		}
	}
</script>

<style lang="scss">
	
	.index {
		flex: 1;
        flex-direction: column;
		display: flex;
		
		.content {
			background: #f8f8f8;
			
			.uni-grid {
				background: #fff;
				padding: $uni-spacing-col-base 0;
				
				.uni-grid-item-hover {
					background-color: none;
				}
			}
			
			.m_cardImg {
				display: flex;
				padding: $uni-spacing-col-base $uni-spacing-row-base;
				background: #FFFFFF;
				flex-direction: row;
				flex-wrap: wrap;
				
				image {
					width: 340upx;
					height: 172upx;
				}
				
				image:nth-child(odd) {
					margin-right: $uni-spacing-row-lg;
				}
				
				image:nth-child(3), image:nth-child(4) {
					margin-top: $uni-spacing-row-lg;
				}
			}
		}
	}
</style>
