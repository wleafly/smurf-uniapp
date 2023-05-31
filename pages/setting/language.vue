<template>
	<view>
		<u-cell-group>
			<u-cell
			    title="中文(简体)"
				:clickable="true"
				size="large"
				@click="choose('zh-Hans')"
				icon="/static/zh.png"
				:style="currentLanguage=='en'?'':'background-color: #eee'"
			></u-cell>
			<u-cell
			    title="English"
				:clickable="true"
				@click="choose('en')"
				size="large"
				icon="/static/en.png"
				:style="currentLanguage=='en'?'background-color: #eee':''"
			></u-cell>
		</u-cell-group>
		
		<!-- <button @click="change" class="btn">{{$t('确认修改')}}</button>s -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				language:-1,
				currentLanguage:this.$i18n.locale
			}
		},

		onReady() {
			
		},
		methods:{

			choose(lang){
				this.currentLanguage=lang
				this.$i18n.locale = lang;
				uni.setLocale(lang)
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