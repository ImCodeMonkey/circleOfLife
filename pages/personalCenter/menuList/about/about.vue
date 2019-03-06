<template>
	<view>
		{{about}}
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: {
			...mapState(['localhost'])
		},
		data() {
			return {
				about: ''
			};
		},
		onLoad() {	//监听页面加载
			uni.request({
				url: this.localhost + '/personalCenter/about',
				method: 'POST',
				success: res => {
					console.log(res)
					this.about = res.data.data[0].about;
				}
			});
		},
	}
</script>

<style>

</style>
