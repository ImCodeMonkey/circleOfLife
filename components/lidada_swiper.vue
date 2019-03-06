<template>
	<view class="">
		<swiper class="lidada-swiper" :class="{statusBarHeightBox: statusBarHeight }" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in listData" :key="index">
				<view class="swiper-item" :class="{statusBarHeight: statusBarHeight }" @tap="onClick" :data-href="item.href" :style="{background:item.background}">
					<image :src="item.image"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	//需要在当前页面手动设置图片的高度  .lidada-swiper swiper{}
	export default {
		name: "lidada-swiper",
		data() {
			return {
				indicatorDots: true,	//指示点
			};
		},
		props: {
			listData : Object,	//传入的数据对象
			jump : String	,//是否跳转链接
			autoplay: String,	//是否自动播放
			statusBarHeight: String,	//是否预留手机状态栏高度
		},
		methods: {
			onClick(e) {	//点击图片触发
				let href = e.currentTarget.dataset.href;
				if(href && this.jump){
					uni.navigateTo({
						url: href
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	$bannerHeight : 375upx;
	$deviceHeight : var(--status-bar-height);
	
	.lidada-swiper{
		height: 375upx;
		position: relative;
		
		.swiper-item{
			width: 750upx;
			position: absolute;
			top: 0;
			float: left;
			height: $bannerHeight;
		}
		
		.statusBarHeight{
			padding-top: $deviceHeight;
		}
		
		& image{
			width: 750upx;
			height: $bannerHeight;
		}
	}
	
	.statusBarHeightBox{
		height: calc(375upx + 45upx);
	}
</style>
