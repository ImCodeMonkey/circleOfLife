<template>
	<view class="content">
		<!--S-banner-->
		<view class="bannerBox">
			<image src="../../static/kuaidifuwu.jpg" mode=""></image>
			<view class="uni-form-item uni-column">
				<view class="with-fun">
					<input class="uni-input" placeholder="请输入快递单号" :value="courierNumbers" @input="courierNumber" />
					<view class="uni-icon uni-icon-search" v-if="showSearchIcon" @click="search"></view>
					<view class="uni-icon uni-icon-scan" @click="scanning"></view>
				</view>
			</view>
		</view>
		<!--E-banner-->
		<!--S-快递记录-->
		<view class="m_timeline">
			<view class="J_expressInformation uni-padding-wrap uni-common-mt">
				<view class="uni-flex uni-row">
					<view class="flex-item">{{courierServicesCompany[0].ShipperName}}</view>
				</view>
			</view>
			<view class="uni-timeline">
				<view class="uni-timeline-item" :class="[index == 0?'uni-timeline-first-item':'']" v-for="(item, index) in expressRecords.list" :key="index" >
					<view class="uni-timeline-item-keynode">{{item.AcceptTime}}</view>
					<view class="uni-timeline-item-divider"></view>
					<view class="uni-timeline-item-content">{{item.AcceptStation}}</view>
				</view>
			</view>
		</view>
		<!--E-快递记录-->
		<!--S-快递公司弹框列表-->
		<view class="m_elasticFrame">
			<neil-modal :show="elasticFrame.show" @close="closeFrame()" @confirm="oddNumberQuery()" title="请选择快递公司">
			    <view class="uni-list">
			    	<radio-group @change="radioChange">
			    		<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in courierServicesCompany" :key="item.value">
			    			<view>
			    				<radio :value="item.ShipperCode" :checked="index === 10000" />
			    			</view>
			    			<view>{{item.ShipperName}}</view>
			    		</label>
			    	</radio-group>
			    </view>
			</neil-modal>
		</view>
		<!--E-快递公司弹框列表-->
	</view>
</template>

<script>
	
	import {
		mapState
	} from 'vuex';
	
	export default {
		data() {
			return {
				"courierNumbers": "",	//快递单号
				"expressCompanyNumber": "",	//快递公司编号
				"showSearchIcon": false,	//搜索按钮显示隐藏
				"courierServicesCompany": [
					{
						"ShipperName":""
					}
				],	//快递公司
				"current": 0,
				"expressRecords": {
					"list": [],
					"state": ""
				},	//快递记录
				"elasticFrame": {
					"show": false
				}
			};
		},
		computed: {
			...mapState(['localhost'])
		},
		onLoad() {
			//更新vuex存储
			this.$store.commit('userInfoUpdate');
		},
		methods: {
			search: function() {	//点击查询
				this.current = 0;
				//查询快递公司
				uni.request({
					url: this.localhost + '/companyIdentification',
					method: 'POST',
					data: {
						LogisticCode: this.courierNumbers
					},
					success: res => {
						var data = res.data.data;
						if(data == null || data.length < 1){	//未查询到快递公司
							uni.showToast({ title: res.data.message, icon: "none" });
						}else if(data.length > 1){	//查询到多家快递公司
							this.courierServicesCompany = data;
							//打开弹框
							this.elasticFrame.show = true;
						}else{	//查询到一家快递公司
							this.courierServicesCompany = data;
							this.expressCompanyNumber = data[0].ShipperCode;
							this.oddNumberQuery()
						}
					},
					fail: () => {},
					complete: () => {
						
					}
				});
			},
			oddNumberQuery: function(){	//快递单号查询
				//查询快递单号
				uni.request({
					url: this.localhost + '/expressInquiry',
					method: 'POST',
					data: {
						ShipperCode: this.expressCompanyNumber,
						LogisticCode: this.courierNumbers
					},
					success: res => {
						console.log(res);
						this.expressRecords.state = res.data.state;
						this.expressRecords.list = res.data.data.reverse();
					},
					fail: () => {},
					complete: () => {
						
					}
				});
			},
			scanning: function() {	//点击调用二维码扫描
				uni.scanCode({
					success: (res) => {
						uni.showToast({ title: '扫描成功', icon: "none" });
						this.courierNumbers = res.result;
						this.showSearchIcon = true;
					}
				});
			},
			courierNumber: function(event) {	//监听输入框文字变化
				this.courierNumbers = event.target.value;
				console.log(this.courierNumber);
				//控制搜索按钮显示隐藏
				if (event.target.value.length > 0) {
					this.showSearchIcon = true;
				} else {
					this.showSearchIcon = false;
				}
			},
			//选择快递公司
			radioChange: function(event) {
				this.expressCompanyNumber = event.detail.value;
			},
			//关闭弹框
			closeFrame: function() {
				this.elasticFrame.show = false;
			}
		}
	}
</script>

<style lang="scss">
	.content {
		flex: 1;
		flex-direction: column;
		display: flex;
		background: $uni-bg-color;
		
		.bannerBox {
			position: relative;
			
			image {
				width: 750upx;
				height: 480upx;
			}
			
			.uni-form-item {
				position: absolute;
				bottom: 125upx;
				margin: 0 22upx;
				width: 704upx;
				height: 80upx;
				line-height: 80upx;
				border: 1upx solid $uni-border-color;
				background: #fff;
				border-radius: 40upx;
				overflow: hidden;
				
				input {
					height: 50upx;
					line-height: 50upx;
					font-size: 34upx;
				}
			}
		}
		
		.m_timeline{
			padding: 0 $uni-spacing-row-sm;
			
			.uni-timeline-first-item .uni-timeline-item-divider{
				background-color:#1AAD19;
			}
		}
	}
</style>
