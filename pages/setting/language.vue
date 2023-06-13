<template>
	<view>

		<view class="item" @click="choose('zh-Hans')" :style="currentLanguage=='en'?'':'background-color: #eee'">
			<image src="../../static/zh.png" ></image>中文(简体)</view>
		<view class="item" @click="choose('en')" :style="currentLanguage=='en'?'background-color: #eee':''">
			<image src="../../static/zh.png" ></image>English</view>

		<!-- <button @click="change" class="btn">{{$t('确认修改')}}</button>s -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				language: -1,
				currentLanguage: this.$i18n.locale
			}
		},

		methods: {

			choose(lang) {
				this.currentLanguage = lang
				this.$i18n.locale = lang;
				uni.setLocale(lang)
				
				/*#ifdef MP*/
					uni.setStorageSync("language",lang)
				/*#endif*/
				
			}
		}
	}
</script>

<style lang="scss">
	.btn {
		margin: 50rpx 30rpx;
		background-color: #89B7EC;
		color: white;
		border-radius: 20rpx;

	}

	.item {
		border-bottom: 1rpx solid #eee;
		display: flex;
		align-items: center;
		padding: 25rpx;
		image{
			width: 40rpx;height: 40rpx;margin: 0 5rpx;
		}
	}
</style>