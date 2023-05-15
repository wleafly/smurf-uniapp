<template>
	<view >
		<!-- 蓝牙设备列表 -->
		<view v-for="item,index in blueToothList" class="blue_item" :style="blueToothStateArr[index]==2?'background-color: #E5F3FF':''">
			<view style="display: flex;flex-direction: row;align-items: center;">
				<image src="../../static/蓝牙-带背景.png" style="width: 100rpx;height: 100rpx;"></image>
				<view style="margin: 0rpx 20rpx;">
					<view class="text-overflow" style="font-size: 35rpx;width: 300rpx;">{{item.name}}</view>
					<view style="color: darkslategray;font-size: 25rpx">{{item.deviceId}}</view>
					<!-- <view style="color: darkslategray;font-size: 25rpx">可连接</view> -->
				</view>
			</view>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<text style="margin-right: 10rpx;color: darkgray;font-size: 20rpx;">{{item.RSSI}} dBm</text>
				<button class="btn_connect" @click="connectBle(index)" 
				:style="{'background-color':blueToothStateArr[index]==0?'':blueToothStateArr[index]==1?'#ccc':'red'}">
				{{blueToothStateArr[index]==0?"连接":blueToothStateArr[index]==1?"连接...":"断开"}}
				</button>
			</view>
		</view>
		
		
		<view v-if="!blueToothList.length" class="content" style="height: 600rpx;">
			<image src="../../static/蓝牙.png" style="width: 120rpx;height: 120rpx"></image>
			<text class="no_blue" style="font-size: 35rpx;font-weight: bold;">没有发现蓝牙设备</text>
			<text class="no_blue">下拉搜索</text>
		</view>
	</view>
</template>

<script>
import toast from '../../uni_modules/uview-ui/libs/config/props/toast';
	export default {
		data() {
			return {
				blueToothList: [],
				blueToothStateArr:[], //代表连接状态，0表示未连接，1表示正在连接，2表示正在使用
				usedDeviceIndex:-1, //记录当前连接到的设备的索引
				connectNum:0,//连接次数，连接蓝牙设备可能多次失败，要自动重连，每次+1,连接成功重置为0
			}
		},
		onLoad() {
			uni.getLocation({
				type: 'wgs84',
				success: function (res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
				},
				fail() {
					uni.showModal({
						content: "请手动开启位置服务",
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}

					})
				}
			});
		},
		onShow() {
			
		},
		methods: {
			//连接蓝牙设备
			connectBle(index){
				uni.stopPullDownRefresh() //关闭动画
				let deviceId = this.blueToothList[index].deviceId
				let that = this
				if(this.blueToothStateArr[index]==0){ //点击了连接
					this.$set(this.blueToothStateArr,index,1) //状态改为正在连接
					this.createBLEConnection(index,deviceId)
				}else if(this.blueToothStateArr[index]==2){ //点击了断开
					//关闭与对应蓝牙设备的连接
					this.$set(that.blueToothStateArr,index,0)
					uni.closeBLEConnection({ 
					  deviceId,
					  success(res) {
					    console.log("关闭蓝牙连接",res)
					  }
					})
					getApp().globalData.isFirstData = true //重新连接后，数据页要从第一条记录开始算了
					getApp().globalData.firstLoading = true //重新连接后，数据页要发f900了，把firstLoading 设置为 true才行 
				}
				
			
			},
			createBLEConnection(index,deviceId){
				this.connectNum++
				if(this.connectNum>5){ //失败5次以上将按钮状态改为未连接时的文字
					this.$set(this.blueToothStateArr,index,0)
					uni.showToast({icon:'none',title: "蓝牙连接失败，请手动重连"})
					this.connectNum = 0
					return
				}
				let that = this
				uni.createBLEConnection({
					deviceId:deviceId,
					timeout:5000,
					success(res) {
						console.log("蓝牙连接成功",res)
						that.connectNum = 0
						that.usedDeviceIndex = index
						uni.stopBluetoothDevicesDiscovery({ //连接到蓝牙设备后，停止搜索蓝牙设备
						  success(res) {
							console.log("提前关闭搜索",res)
						  }
						})
						uni.stopPullDownRefresh() //提前关闭加载动画
						that.connectionStateChange()
						setTimeout(()=>{
							uni.getBLEDeviceServices({
								deviceId:deviceId,
								success(res) {
									console.log("获取服务",res)
									let notifyCharacteristicId = null
									let writeCharacteristicId = null
									let tag = true //判断是否需要继续找特征值
									for(var service of res.services){  
										let serviceId = service.uuid
										uni.getBLEDeviceCharacteristics({
											deviceId:deviceId,
											serviceId:serviceId,
											success:(res)=>{
												console.log('特征值',res.characteristics)
												for(var characteristic of res.characteristics){
													if(characteristic.properties.notify && !notifyCharacteristicId){
														notifyCharacteristicId = characteristic.uuid
														
													}
													if(characteristic.properties.write && !writeCharacteristicId){
														writeCharacteristicId = characteristic.uuid					
														
													}
												}
												if(notifyCharacteristicId&&writeCharacteristicId&&tag){
													tag = false
													console.log('执行最后一步')
													console.log('notifyCharacteristicId是',notifyCharacteristicId)
													console.log('writeCharacteristicId是',writeCharacteristicId)
				
													
													uni.notifyBLECharacteristicValueChange({
													  state: true, // 启用 notify 功能
													  deviceId:deviceId,
													  serviceId:serviceId,
													  characteristicId:notifyCharacteristicId,
													  success:(res)=> {
														console.log("启动notify服务成功")
														//执行到这一步才能写数据
														that.$set(that.blueToothStateArr,index,2) //连接成功，将按钮文字改为断开
														getApp().globalData.deviceArr = [] //清除数据，二次连接时有用
														getApp().globalData.valueArr = []
														getApp().globalData.deviceName = that.blueToothList[index].name
														getApp().globalData.deviceCoreData = { //存储各种id到全局变量，其他页面也要用
															deviceId:deviceId,
															serviceId:serviceId,
															notifyCharacteristicId:notifyCharacteristicId,
															writeCharacteristicId:writeCharacteristicId
														}
														
														// console.log('服务获取成功:',getApp().globalData.deviceCoreData)
														
														// setTimeout(()=>{
														// 	getApp().writeValueToBle('F900',getApp().handleStrFromBlueTooth,()=>{
														// 		that.$set(that.blueToothStateArr,index,0)
														// 	})},1000)
												
													  },
													  fail:(res)=> {
														console.log('启动notify服务失败', res.errMsg)
														that.$set(that.blueToothStateArr,index,0)
														uni.showToast({icon:'none',title: "启动notify服务失败"})
													  }
													})
				
												}
				
											},
											fail:(res)=>{
												console.log(res)
												that.$set(that.blueToothStateArr,index,0)
												uni.showToast({icon:'none',title: "获取特征值失败"})
											}
										})
										
									}
									
								},
								fail(err) {
									console.error(err)
									that.$set(that.blueToothStateArr,index,0)
									uni.showToast({icon:'none',title: "获取服务失败"})
								}
								
							})
						},1000)
				
						// that.getServices()
					},
					fail(res) {
						uni.showToast({icon:'none',title: "连接失败,尝试第"+that.connectNum+"次重连"})
						console.log("蓝牙连接第"+that.connectNum+"次失败",res)

						setTimeout(()=>{
							that.createBLEConnection(index,deviceId)
							},5000) //连接失败时，5秒后自动重连
					}
				})
			},

			initBlueToothList() { //初始化数据，将蓝牙设备以列表显示
				this.blueToothList = [] //清空已有数据
				this.blueToothStateArr = []
				let that = this
				uni.openBluetoothAdapter({
					success(res) {
						console.log("初始化蓝牙模块", res)
						uni.startBluetoothDevicesDiscovery({
							success(res) {
								console.log("搜索蓝牙", res)
								uni.onBluetoothDeviceFound((res) => {
									for(var device of res.devices){
										if(device.localName!=''||device.name!=''){
											console.log(device)
											that.blueToothStateArr.push(0) //默认状态是未连接
											that.blueToothList.push(device)
										}
									}
								})
								setTimeout(()=>{ //一旦成功进入搜索状态，10秒后自动关闭搜索
									uni.stopBluetoothDevicesDiscovery({ //停止搜索蓝牙设备
									  success(res) {
										console.log("关闭搜索",res)
									  }
									})
									uni.stopPullDownRefresh() //提前关闭加载动画
								},10000)
							},
							fail(err) {
								console.error("搜索失败", err)
								uni.stopPullDownRefresh() //提前关闭加载动画
							}
						})
						
					},
					fail(err) {
						uni.showToast({
							title: "蓝牙未开启，请手动开启蓝牙",
							icon: "none"
						})
						uni.stopPullDownRefresh() //关闭动画
					}
				})
				
			
			
			},
					

			//监听连接状态改变的事件
			connectionStateChange(){
				let that = this
				uni.onBLEConnectionStateChange((res) => {
					if(res.connected == false){
						// console.log(`当前断开的设备：${res.deviceId}`)
						// console.log(`当前deviceCoreData存的设备：${getApp().deviceCoreData.deviceId}`)
						// if(res.deviceId == getApp().deviceCoreData.deviceId){
						// 	console.log("判断成功")
						// }
						uni.showToast({icon:'none',title: "设备连接断开"})
						getApp().globalData.firstLoading = true
						that.$set(that.blueToothStateArr,that.usedDeviceIndex,0)
					}
				})
			},
			

		},
		onPullDownRefresh() {
			
			this.initBlueToothList()
			//查找蓝牙设备

		}
	}
</script>

<style>
	.text-overflow{
		word-break:keep-all; /* 不换行 */
		white-space:nowrap; /* 不换行 */	
		overflow:hidden; /* 内容超出宽度时隐藏超出部分的内容 */
		text-overflow:ellipsis; /*溢出时显示省略标记...；需与overflow:hidden；一起使用*/
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.no_blue {
		margin-top: 20rpx;
		color: #bfbfbf;
	}

	page {
		background-color: #eeeeee;
	}

	.blue_item {
		box-shadow: 2px 2px 2px darkgray;
		;
		background-color: white;
		padding: 20rpx 20rpx;
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 10rpx;
		border-radius: 10rpx;
	}

	.btn_connect {
		background-color: #0079F5;
		color: white;
		font-weight: bold;
		font-size: 30rpx;
		margin-top: 20rpx;
	}
</style>
