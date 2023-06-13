<template>
	<view>
		<uni-popup ref="waiting" type="dialog" :mask-click="false">
			<view class="out">
				<view style="display: flex;align-items: center;">
					<image src="../../static/logo.png" style="width: 60rpx;height: 60rpx;"></image>
					<text style="font-size: 35rpx;margin-left: 20rpx;">{{title}}</text>
				</view>
				<view style="display: flex;align-items: center;margin: 20rpx 0;">
					<u-loading-icon mode='circle' size="30" color="orange" style="margin: 5rpx;"></u-loading-icon>
					<text style="color: darkgray;margin-left: 20rpx;">{{content}}</text>
				</view>
				<view v-if="showHide" style="display: flex;justify-content: flex-end;">
					<text style="color: orange;" @click="close()">隐藏</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"waiting",
		props:["title","content","showHide"],
		data() {
			return {
				
			};
		},
		methods:{
			open() {
				this.$refs.waiting.open()
			},
			close(){
				this.$refs.waiting.close()
			}
		}
	}
</script>

<style lang="scss">
	.out {
		background-color: white;
		width: 500rpx;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		padding: 30rpx;
	}
</style>