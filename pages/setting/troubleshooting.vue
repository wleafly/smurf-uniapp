<template>
	<view>
		<view style="display: flex;flex-direction: column;;justify-content: center;align-items: center;height: 500rpx;">
		
			<circle-animation size="100" v-if="isWait"></circle-animation>
			<view v-else>
				<icon v-if="isUseful" type="success" style="margin-top: 50rpx;" size="100" color="#00ff80"></icon>
				<icon v-else type="warn" style="margin-top: 50rpx;" size="100" color="#ffcd69"></icon>
				
			</view>
		</view>
		
		<view v-for="i,index in sequenceArr" style="color: dimgray;font-size: 40rpx;display: flex;justify-content: space-between;padding: 40rpx 120rpx">
			<view>{{i}}</view>
			
			<u-loading-icon v-if="statusArr[index]==0" color="#89B7EC" mode="semicircle"></u-loading-icon>
			<image v-else-if="statusArr[index]==1" src="../../static/tick.png" style="width: 40rpx;height: 40rpx;"></image>
			<image v-else src="../../static/fork.png" style="width: 40rpx;height: 40rpx;"></image>
		</view>
		
		<!-- <view v-if="!isWait" style="color: darkgray;text-align: center;margin-top: 180rpx;">错误码：10003，蓝牙设备断开连接</view> -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isWait:true,
				isUseful:false,
				sequenceArr:[this.$t("连接设备")],
				statusArr:[0,0,0] //0等待，1成功，2失败
			};
		},
		methods:{
			showModal(txt){
				uni.showModal({
					content:txt,
					showCancel:false
				})
			}
		},
		onReady() {
			// setTimeout(()=>{
			// 	this.statusArr[0] = 1
			// 	this.sequenceArr.push("测试指令")
			// 	setTimeout(()=>{
			// 		this.statusArr[1] = 1
			// 		this.sequenceArr.push("分析数据")
			// 		setTimeout(()=>{
			// 			this.statusArr[2] = 2
			// 			this.isWait = false
			// 			// this.isUseful = false
			// 		},1000)
			// 	},1000)
			// },1000)
			
			if(getApp().globalData.deviceCoreData.deviceId){
				let that = this
				uni.getConnectedBluetoothDevices({ //获取处于已连接状态的设备
				  success(res) {
					  let isConnect = false
					  for(let device of res.devices){
						  // console.log(device.deviceId)
						  if(device.deviceId == getApp().globalData.deviceCoreData.deviceId){
							  isConnect = true
						  }
					  }
					  if(isConnect){
						  that.statusArr[0] = 1
						  that.sequenceArr.push(that.$t("测试指令"))
						  let haveHeadData = false
						  let isSendSuccess = false
						  let isFirstGetData = true
						  let tempStr = ""
						  let getFirstValue = true
						  setTimeout(()=>{ //30秒没接到花括号数据，则指令测试失败
							if(isFirstGetData){
								that.showModal(that.$t("未获取到数据"))
								that.statusArr[1] = 2
								that.isWait = false
							}else{
								if(!haveHeadData){
								 that.showModal(that.$t("数据获取异常，无法识别传感器类型"))
								 that.statusArr[2] = 2
								 that.isWait = false
								}
							}
						    
						  },30000)
						  getApp().writeValueToBle('F900',(str)=>{ //写数据成功时
						    console.log(str)
							if(isFirstGetData){
								console.log('第一次收到数据')
								that.statusArr[1] = 1
								that.sequenceArr.push(that.$t("分析数据"))
								isFirstGetData = false

							}
							if(str.startsWith('[')&&str.endsWith(']')){
							    haveHeadData = true
								// console.log("发现中括号数据",str)
							}
							if(haveHeadData&&getFirstValue){
								// console.log("收到有效数据",str)
								if(str.startsWith('{')&&str.endsWith('}')){						
									tempStr = str
								}else if(str.startsWith('{')&&!str.endsWith('}')){				
									tempStr = str
								}else if(!str.startsWith('{')&&!str.endsWith('}')&&str.indexOf('[')==-1){	
									tempStr = tempStr + str
								}else if(!str.startsWith('{')&&str.endsWith('}')){
									tempStr = tempStr + str
								}
								
								if(tempStr.startsWith('{')&&tempStr.endsWith('}')){
									// console.log(tempStr)
									getFirstValue = false
									let arr = tempStr.slice(1,tempStr.length-2).split(',')
									console.log('电量',parseFloat(arr[arr.length-3]))
									if(parseFloat(arr[arr.length-3])>3.2){
										// //指令测试成功
										that.statusArr[2] = 1
										that.isUseful = true
										that.isWait = false

									}else{
										that.statusArr[2] = 2
										that.isUseful = false
										that.isWait = false
										that.showModal(that.$t("电量不足,请及时充电"))
									}

								}
							}

							},()=>{ //写数据失败时
							  that.showModal(that.$t("指令发送失败"))
							  that.sequenceArr[1] = 2
							  that.isWait = false
						  })

					  }else{
						  this.isWait = false
						  that.showModal(that.$t("设备连接断开"))
						  that.statusArr[0] = 2
					  }
				    
				  }
				})
			}else{
				this.isWait = false
				this.showModal(this.$t("请先连接设备"))
				this.statusArr[0] = 2
			}
			
			
		}
	}
</script>

<style>

</style>