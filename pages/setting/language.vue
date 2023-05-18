<template>
	<view>
		<u-cell-group>
			<u-cell
			    :title="i18n('simplifiedChinese')"
				:clickable="true"
				size="large"
				@click="choose(1)"
				icon="/static/zh.png"
			></u-cell>
			<u-cell
			    :title="i18n('english')"
				:clickable="true"
				@click="choose(2)"
				size="large"
				icon="/static/en.png"
			></u-cell>
		</u-cell-group>
		
		<button @click="change" class="btn">{{$t('deviceName_button')}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				language:-1,
			}
		},
		onReady() {
			
		},
		methods:{
			//为控件的属性动态绑定内容
			i18n(key) {
			    return this.$i18n.messages[this.$i18n.locale][key]
			},
			choose(index){
				if(index == 1){
					this.index = 1
					console.log('点击简体中文')
				}else if (index == 2){
					this.index = 2
					console.log('点击English')
				}
			},
			change(){
				if (this.index == 1){
					this.$i18n.locale = 'zh-Hans';
					uni.setStorageSync('lang', 'zh-Hans');
				}else if (this.index == 2){
					this.$i18n.locale = 'en';
					uni.setStorageSync('lang', 'en');
				}
				
				let lang = uni.getStorageSync('lang') || 'zh-Hans'
				if (lang === 'zh-Hans') {
				  lang = 'en'
				} else {
				  lang = 'zh-Hans'
				}
				uni.setStorageSync('lang', lang)
				uni.reLaunch({
				  url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>
	.btn{
		margin: 50rpx 30rpx;
		background-color: #89B7EC;
		color: white;
		border-radius: 20rpx;
		
	}
</style>