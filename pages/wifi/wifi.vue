<template>
	<view >
		<!-- 蓝牙设备列表 -->
		<view @longpress="getBluetoothInfo(index)" v-for="item,index in blueToothList" class="blue_item" :style="blueToothStateArr[index]==2?'background-color: #E5F3FF':''">
			<view style="display: flex;flex-direction: row;align-items: center;">
				<image src="../../static/bluetooth_blue.png" style="width: 100rpx;height: 100rpx;"></image>
				<view style="margin: 0rpx 20rpx;">
					<view class="text-overflow" style="font-size: 35rpx;width: 300rpx;">{{item.localName?item.localName:item.name}}</view>
					<view class="text-overflow" style="color: darkslategray;font-size: 25rpx;width: 300rpx;">{{item.deviceId}}</view>
				</view>
			</view>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<text style="margin-right: 10rpx;color: darkgray;font-size: 20rpx;">{{item.RSSI}} dBm</text>
				<button class="btn_connect" @click="connectBle(index)" 
				:style="{'background-color':blueToothStateArr[index]==0?'':blueToothStateArr[index]==1?'#ccc':'red'}">
				{{blueToothStateArr[index]==0?$t("连接"):blueToothStateArr[index]==1?($t("连接")+"..."):$t("断开")}}
				</button>
			</view>
		</view>
		
		
		<view v-if="!blueToothList.length" class="content" style="height: 600rpx;">
			<image src="../../static/bluetooth_gray.png" style="width: 120rpx;height: 120rpx"></image>
			<text class="no_blue" style="font-size: 35rpx;font-weight: bold;">{{$t('没有发现蓝牙设备')}}</text>
			<text class="no_blue">{{$t('下拉搜索')}}</text>
		</view>
		<!-- 重连次数{{reconnectTimes}} -->
		<!-- <button @click="sendFA()">FA</button> -->
		
<!-- 		<input style="border: 1rpx solid gray;margin: 40rpx 0;height: 50rpx;" placeholder="请输入指令" v-model:value="command"/>
		<button @click="sendCommand">发送指令</button> -->
	</view>
</template>

<script>
import toast from '../../uni_modules/uview-ui/libs/config/props/toast';
	export default {
		data() {
			return {
				command:"",//测试指令
				blueToothList: [],
				blueToothStateArr:[], //代表连接状态，0表示未连接，1表示正在连接，2表示正在使用
				usedDeviceIndex:-1, //记录当前连接到的设备的索引
				connectNum:0,//连接次数，连接蓝牙设备可能多次失败，要自动重连，每次+1,连接成功重置为0
				isManualClose:false,
				// reconnectTimes:0
			}
		},
		onLoad() {
			let that = this
			
			/*#ifdef MP*/
			    console.log('小程序端定位提示')
				wx.getLocation({
				    type: 'wgs84',
				    success (res) {
				        console.log(res.latitude, res.longitude)
				    },
					fail() {
						uni.showModal({
							content: that.$t('请手动开启位置服务'),
							success(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						})
					}
				})
			/*#endif*/
			
			/*#ifndef MP*/
			uni.getLocation({
				type: 'wgs84',
				success: function (res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
				},
				fail() {
					uni.showModal({
						content: that.$t('请手动开启位置服务'),
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
			/*#endif*/
		},
		onShow() {
			
		},
		methods: {
			getBluetoothInfo(index){
				let info = getApp().ab2hex(this.blueToothList[index].advertisData) //advertisData是arrayBuffer类型，需转化
				console.log(this.hexToString(info))
				return this.hexToString(info)
			},
			hexToString(str){
			　　var val="",len = str.length/2
			　　for(var i = 0; i < len; i++){
			　　　　val += String.fromCharCode(parseInt(str.substr(i*2,2),16))
			　　}
				return val
			},
			sendCommand(){
				// console.log(this.command)
				getApp().writeValueToBle(this.command,(str)=>{
					console.log(str)
				})
			},
			sendFA(){
				getApp().writeValueToBle('FA',(str)=>{
					console.log(str)
				})
			},
			showJson(index){
				console.log('showJson')
				uni.showModal({
					content:JSON.stringify(this.blueToothList[index])
				})
			},

			//连接蓝牙设备
			connectBle(index){
				
				let deviceId = this.blueToothList[index].deviceId
				let that = this
				if(this.blueToothStateArr[index]==0){ //点击了连接
					this.$set(this.blueToothStateArr,index,1) //状态改为正在连接
					uni.stopPullDownRefresh() //关闭动画
					uni.stopBluetoothDevicesDiscovery({ //连接到蓝牙设备后，停止搜索蓝牙设备
					  success(res) {
						console.log("提前关闭搜索",res)
					  }
					})
					setTimeout(()=>{this.createBLEConnection(index,deviceId)},1000)
					
				}else if(this.blueToothStateArr[index]==2){ //点击了断开
					//关闭与对应蓝牙设备的连接
					this.$set(that.blueToothStateArr,index,0)
					this.isManualClose = true
					uni.closeBLEConnection({
					  deviceId,
					  success(res) {
					    console.log("手动关闭蓝牙连接",res)
					  }
					})
					getApp().globalData.isFirstData = true //重新连接后，数据页要从第一条记录开始算了
					getApp().globalData.firstLoading = false //断开连接后，进数据页就不要发f900了
				}
				
			
			},
			createBLEConnection(index,deviceId){
				
				/*#ifndef MP*/
					this.connectNum++
					if(this.connectNum>5){ //失败5次以上将按钮状态改为未连接时的文字
						this.$set(this.blueToothStateArr,index,0)
						uni.showToast({icon:'none',title: this.$t("蓝牙连接失败，请手动重连")})
						this.connectNum = 0
						return
					}
				/*#endif*/

				let that = this
				uni.createBLEConnection({
					deviceId:deviceId,
					timeout:5000,
					success(res) {
						console.log("蓝牙连接成功",res)
						that.connectNum = 0
						that.usedDeviceIndex = index
						// uni.stopBluetoothDevicesDiscovery({ //连接到蓝牙设备后，停止搜索蓝牙设备
						//   success(res) {
						// 	console.log("提前关闭搜索",res)
						//   }
						// })
						// uni.stopPullDownRefresh() //提前关闭加载动画
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
														console.log("广播包内容",that.getBluetoothInfo(index))
														if(that.getBluetoothInfo(index) == "V2"){ //识别到V2会直接设定为新设备
															console.log('有版本号，是新设备')
															getApp().globalData.isNewDevice = true
														}else{
															console.log('无版本号，是旧设备')
															getApp().globalData.isNewDevice = false
														}
														//执行到这一步才能写数据
														that.$set(that.blueToothStateArr,index,2) //连接成功，将按钮文字改为断开
														getApp().globalData.deviceArr = [] //清除数据，二次连接时有用
														getApp().globalData.valueArr = []
														getApp().globalData.addressToParamMap = []
														
														getApp().globalData.includeParamArr = [] //二次连接时，也要清除历史数据，这样进入历史数据页就能重新发f6指令了
														getApp().globalData.normalValueArr = []
														getApp().globalData.manyParamValueArr = []
														
														getApp().globalData.deviceName = that.blueToothList[index].name
														getApp().globalData.deviceCoreData = { //存储各种id到全局变量，其他页面也要用
															deviceId:deviceId,
															serviceId:serviceId,
															notifyCharacteristicId:notifyCharacteristicId,
															writeCharacteristicId:writeCharacteristicId
														}
														
														getApp().globalData.firstLoading = true //把断开连接后进首页重新加载改成连接成功后重新加载

													  },
													  fail:(res)=> {
														console.log('启动notify服务失败', res.errMsg)
														that.$set(that.blueToothStateArr,index,0)
														uni.showToast({icon:'none',title: that.$t("启动notify服务失败")})
													  }
													})
				
												}
				
											},
											fail:(res)=>{
												console.log(res)
												that.$set(that.blueToothStateArr,index,0)
												uni.showToast({icon:'none',title:that.$t("获取特征值失败")})
											}
										})
										
									}
									
								},
								fail(err) {
									console.error(err)
									that.$set(that.blueToothStateArr,index,0)
									uni.showToast({icon:'none',title: that.$t("获取服务失败")})
								}
								
							})
						},2000)
				
						// that.getServices()
					},
					fail(res) {
						/*#ifndef MP*/
							  uni.showToast({icon:'none',title: that.$t("连接失败,尝试第")+that.connectNum+that.$t("次重连")})
							  console.log("蓝牙连接第"+that.connectNum+"次失败",res)
							  setTimeout(()=>{
								that.createBLEConnection(index,deviceId)
							  },5000) //连接失败时，5秒后自动重连  
						/*#endif*/
						
						/*#ifdef MP*/
							that.$set(that.blueToothStateArr,index,0)
						    uni.showToast({icon:'none',title: that.$t("连接失败")})
						/*#endif*/

					}
				})
			
			},

			initBlueToothList() { //初始化数据，将蓝牙设备以列表显示
				/*#ifndef MP*/
				     this.blueToothList = [] //清空已有数据
				     this.blueToothStateArr = []
				/*#endif*/

				let that = this
				uni.openBluetoothAdapter({
					success(res) {
						console.log("初始化蓝牙模块", res)
						uni.startBluetoothDevicesDiscovery({
							success(res) {
								console.log("搜索蓝牙", res)
								uni.onBluetoothDeviceFound((res) => {
									for(var device of res.devices){
										if(device.localName!='' && device.name!=''){ //苹果机上localName可能不存在
											console.log('识别到设备:',device)
											that.blueToothStateArr.push(0) //默认状态是未连接
											let repeatIndex = that.blueToothList.findIndex((item)=>{return item.deviceId==device.deviceId})
											if(repeatIndex==-1){ //苹果机会识别重复的设备
												that.blueToothList.push(device)
											}else{
												if(that.blueToothList[repeatIndex].localName==undefined){ //重复项没有localName，则替换，ios机型上有用
													that.blueToothList[repeatIndex] = device
												}
											}
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
							title: that.$t("蓝牙未开启，请手动开启蓝牙"),
							icon: "none"
						})
						uni.stopPullDownRefresh() //关闭动画
					}
				})
				
			
			
			},
					

			//监听连接状态改变的事件
			connectionStateChange(){
				console.log('绑定connectionStateChange方法')
				let that = this
				uni.onBLEConnectionStateChange((res) => {
					if(res.connected == false){
						// getApp().globalData.firstLoading = true
						console.log(res.deviceId+'断开连接')
						that.$set(that.blueToothStateArr,that.usedDeviceIndex,0)
						if(that.isManualClose){
							uni.showToast({icon:'none',title: that.$t("手动断开连接")})
							setTimeout(()=>{
								that.isManualClose = false
							},500)
						}else{ //被动断开连接
							/*#ifndef MP*/
							uni.showToast({icon:'none',title: that.$t("设备连接断开")})
							setTimeout(()=>{
								//1秒后自动重连
								if(res.deviceId==getApp().globalData.deviceCoreData.deviceId){
									that.reConnectBle(4) //最多重连4次		
								}
							},1000)
							/*#endif*/
							
							/*#ifdef MP*/
							uni.showToast({icon:'none',title: that.$t("设备连接断开，重连中")})
							setTimeout(()=>{
								//1秒后自动重连
								if(res.deviceId==getApp().globalData.deviceCoreData.deviceId){
									that.reConnectBle(1) //小程序端重连失败会自动触发connectionStateChange	
								}
							},1000)
							/*#endif*/

						}


					}
				})
			},
			
			reConnectBle(num){  //num代表最大重连次数
				let that = this
				if(num>0){
					uni.createBLEConnection({
						deviceId:getApp().globalData.deviceCoreData.deviceId,
						success(res) {
							console.log("重连成功")
							setTimeout(()=>{
								uni.notifyBLECharacteristicValueChange({
								  state: true, // 启用 notify 功能
								  deviceId:getApp().globalData.deviceCoreData.deviceId,
								  serviceId:getApp().globalData.deviceCoreData.serviceId,
								  characteristicId:getApp().globalData.deviceCoreData.notifyCharacteristicId,
								  success:(res)=> {
									console.log("重启notify服务成功")
									//执行到这一步才能写数据
									that.$set(that.blueToothStateArr,that.usedDeviceIndex,2) //重连成功，将按钮文字重新改为断开			
									uni.showToast({
										title:that.$t('重连成功'),
										icon:'none'
									})
									// that.reconnectTimes++
								  },
								  fail:(res)=> {
									// console.log(res.errMsg)
									console.log("重启notify服务失败,剩余重连"+num+"次")
									setTimeout(()=>{
										that.reConnectBle(--num)
									},3000)
								  }})
							},1000)
					
						},fail(res) {
							console.log("重连失败,剩余重连"+num+"次")
							setTimeout(()=>{
								that.reConnectBle(--num)
							},3000)
							
						}
					})
				}
				
				
			}
			

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
