<template>
	<view>
		<view style="background-color: white;height: 100rpx;font-size: 35rpx;margin: 30rpx;border-radius: 30rpx;
		display: flex;align-items: center;justify-content: space-between;padding-left: 30rpx;padding-right: 30rpx;">
			<view>{{$t('实时数据自动下载')}}</view>
			<switch :checked="autoDownload" @change="switchChange"></switch>
			
		</view>
		<view style="background-color: white;border-radius: 30rpx;padding: 30rpx;margin: 30rpx;">
			<view style="font-size: 35rpx;">{{$t('多参数配置')}}</view>
			
			<view v-for="i,index in localArr" class="param_item" style="color: gray;display: flex;justify-content: space-between;margin: 20rpx 0;">
				<view>{{$t('参数')}}{{index+1}}{{$t('配置')}}{{index==0?$t('(默认)'):''}}</view>
				<picker style="width: 300rpx;" @change="bindPickerChange(index,$event)" :value="index==0?codCanSelect.findIndex(item=>{item==i}):canSelectParamArr.findIndex(item=>{return item==i})" :range="index==0?codCanSelect.map((item)=>{return $t(item)}):canSelectParamArr.map((item)=>{return $t(item)})">
					<view style="float: right;">{{$t(i)}}</view>
				</picker>
			</view>
			<view style="display: flex;">
				<button style="background-color: lightgray;color: white;margin-top: 30rpx;width: 45%;" @click="toDefault">{{$t('恢复默认')}}</button>
				<button style="background-color: #89B7EC;color: white;margin-top: 30rpx;width: 45%;" @click="storageConfig">{{$t('保存配置')}}</button>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoDownload:null,
				localArr:[],
				codCanSelect:['COD','未连接'],
				canSelectParamArr:[]
			}
		},
		methods: {
			storageConfig(){
				console.log("保存多参数配置")
				uni.setStorageSync("manyParamsConfig",this.localArr)
				uni.showToast({
					title:"保存成功",
					icon:'success'
				})
			},
			toDefault(){
				this.localArr = getApp().globalData.manyParamsDefalut.slice(0)

			},
			switchChange(e){
				uni.setStorageSync("autoDownload",e.detail.value)
				if(e.detail.value){
					getApp().globalData.autoDownload = true 
				}else{
					getApp().globalData.autoDownload = false
					
				}
			},
			bindPickerChange(index,e){
				if(index == 0){
					this.$set(this.localArr,0,this.codCanSelect[e.detail.value])
				}else{
					this.$set(this.localArr,index,this.canSelectParamArr[e.detail.value])
				}

			}
		},
		onLoad(){
			this.canSelectParamArr = getApp().globalData.manyParamCustomOptions
			this.autoDownload = getApp().globalData.autoDownload
		},
		onShow() {
			let arr = uni.getStorageSync("manyParamsConfig") || getApp().globalData.manyParamsDefalut
			this.localArr = arr
			
		},

	}
</script>

<style>
	page {
		background-color: #eee;
	}


</style>