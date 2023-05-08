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
	export default {
		data() {
			return {
				// blueInfoArr:[],
				blueToothList: [],
				blueToothStateArr:[], //代表连接状态，0表示未连接，1表示正在连接，2表示正在使用
				deviceId:'',
				serviceId:'',
				characteristics:[],
				notifyCharacteristicId:'',
				writeCharacteristicId:'',
				tempStr:'', //临时数据，可以是字符串或数组
				isFirstData:true,
				isNewDevice:false,
	
				oldParamId:null,
				param:'', //单/多参数
			
				addressToParamMap:[],

			}
		},
		onLoad() {
			
		},
		onShow() {

		},
		methods: {
			//连接蓝牙设备
			connectBle(index){
				uni.stopPullDownRefresh() //关闭动画
				let deviceId = this.blueToothList[index].deviceId
				let that = this
				if(this.blueToothStateArr[index]==0){
					this.$set(this.blueToothStateArr,index,1) //状态改为正在连接
					// setTimeout(()=>{
					// 	this.$set(this.blueToothStateArr,index,2)
					// },3000)
					
					uni.createBLEConnection({
						deviceId:deviceId,
						timeout:5000,
						success(res) {
							console.log("蓝牙连接成功",res)
							setTimeout(()=>{
								uni.getBLEDeviceServices({
									deviceId:deviceId,
									success(res) {
										console.log("获取服务",res)
										// let serviceId = res.services[1].uuid
					
										// that.serviceId = serviceId
										// console.log("获取服务成功")
										// that.getBLEDeviceCharacteristics()
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
															console.log("启动notify成功")
															let msg = 'F900'
															var typedArray = new Uint8Array(msg.match(/[\da-f]{2}/gi).map(function (h) {return parseInt(h, 16)}))
														
															setTimeout(()=>{
																uni.writeBLECharacteristicValue({
																	deviceId:deviceId,
																	serviceId:serviceId,
																	characteristicId:writeCharacteristicId,
																	value:typedArray.buffer,
																	success(res) {
																		// uni.showToast({icon:'none',title: "f900发送成功"})
																		// console.log(res)
																		console.log("数据发送成功")
																		that.$set(that.blueToothStateArr,index,2) //只有执行到这一步，才算连接成功
																		getApp().globalData.deviceArr = [] //清除数据，二次连接时有用
																		getApp().globalData.valueArr = []
																		getApp().globalData.deviceName = that.blueToothList[index].name
																		getApp().globalData.deviceCoreData = { //存储各种id到全局变量，其他页面也要用
																			deviceId:deviceId,
																			serviceId:serviceId,
																			notifyCharacteristicId:notifyCharacteristicId,
																			writeCharacteristicId:writeCharacteristicId
																		}
																		uni.onBLECharacteristicValueChange(res => {
																			// console.log("值改变")
																			// console.log(res)
																			let resHex = that.ab2hex(res.value)
																			// this.messageHex.value = resHex
																			let result = that.hexCharCodeToStr(resHex)
																			result = String(result)
																			// console.log(result)
																			that.handleStrFromBlueTooth(result)
		    
																		})
																	},
																	fail(err) {
																		that.$set(that.blueToothStateArr,index,0)
																		uni.showToast({icon:'none',title: "数据发送失败"})
																		console.log("数据发送失败",err)
																	}
																})
																														 
															},1000)
													
														  },
														  fail:(res)=> {
															console.log('启动notify失败', res.errMsg)
															that.$set(that.blueToothStateArr,index,0)
															uni.showToast({icon:'none',title: "启动notify失败"})
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
							// uni.showToast({icon:'none',title: "蓝牙连接失败"})
							console.log("蓝牙连接失败",res)
							that.$set(that.blueToothStateArr,index,0)
							uni.showToast({icon:'none',title: "蓝牙连接失败"})
						}
					})
								
					
				}else if(this.blueToothStateArr[index]==2){
					//关闭与对应蓝牙设备的连接
					this.$set(that.blueToothStateArr,index,0)
					uni.closeBLEConnection({
					  deviceId,
					  success(res) {
					    console.log("关闭蓝牙连接",res)
					  }
					})
					this.isFirstData = true //重新连接后，要从第一条开始算了
				}
				
			
			},
			handleStrFromBlueTooth(result){
				if(result.charAt(0)=='['){ //[6,0,6,]格式的设备类型
					result = result.slice(1,result.length-1)
					result = result.split(',')
					console.log('完整的头数据',result)
				
					//把传感器类型信息记录到全局变量deviceArr
					getApp().globalData.deviceArr.push({
						address:parseInt(result[0]),
						type:parseInt(result[1]),
						param:parseInt(result[2]),
					})
					//在数组中添加地址和参数id的映射关系
					this.addressToParamMap[parseInt(result[0])] = parseInt(result[2])
					this.oldParamId = parseInt(result[2]) //存下当前的参数类型，若是老设备，接收的值不带地址，可以利用这个变量
				}else if(result.charAt(result.length-1)!='}'){ //数据过长，对数据进行拼接
					this.tempStr = result //前半截数据
				}else if(result.charAt(0)!='{' && result.charAt(result.length-1)=='}'){ //第一位不是'{',且最后一位是'}'
					this.tempStr = this.tempStr + result 
					this.tempStr = this.tempStr.slice(1,this.tempStr.length-1)
					this.tempStr = this.tempStr.split(',')
					this.tempStr.pop()
					console.log("完整的值数据:",this.tempStr)
					
					if(getApp().globalData.deviceArr.length>0){
						this.judgeNewOrOld()
						this.storageValue(this.tempStr.map(Number)) //.map(Number)可以将字符串数组转为数字类型的数组
					}

					
				
				}else{ //由于较短，可单行获取的完整数据
					result = result.slice(1,result.length-1)
					result = result.split(',')
					this.tempStr = result
					this.tempStr.pop()
					console.log("完整的值数据：")
					console.log(this.tempStr)
					// this.blueInfoArr.push(this.tempStr)
				
					
					if(getApp().globalData.deviceArr.length>0){
						this.judgeNewOrOld()
						this.storageValue(this.tempStr.map(Number))
					}

					
				}
					
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
					
			judgeNewOrOld(){  //判断是新设备还是老设备
				
				if(this.isFirstData){ //第一次获取到带{}的数据时执行
					console.log("判断新旧设备")
					let deviceArr = getApp().globalData.deviceArr
					console.log(deviceArr)
					// console.log()
					if(deviceArr.length>1){ //能接多个传感器，必定是新设备
						this.isNewDevice = true 
					}else{
						if(this.tempStr.length==6||this.tempStr.length==8){
							this.isNewDevice = true
						}else if(this.tempStr.length==5){ 
							if(deviceArr[0].param==4){ //ORP
								this.isNewDevice = true
							}else{
								this.isNewDevice = false
							}
						}else{//长度为4、7的情况
							this.isNewDevice = false
						}
					}
					if(this.isNewDevice){
						console.log('看起来是新设备')
					}else{
						console.log('看样子是老设备')
					}
					
				}
			},
			storageValue(numArr){  //存数据到全局变量valueArr中，接收参数是一个数字数组
				let record = {}
				if(getApp().globalData.deviceArr[0].type!=1){  //不接多功能传感器的情况
					if(this.isNewDevice){ //新设备，第0项是地址
						let param = this.addressToParamMap[numArr[0]]
						if(param!=4){ //不为ORP
							record = {
								param:param,
								value:numArr[1],
								temperature:numArr[2],
								electric:param!=9?numArr[3]:numArr[5] 
							}
							if(param==9){
								record.mud = numArr[3]
								record.bod = numArr[4]
							}
						}else{ //ORP
							record = {
								param:param,
								value:numArr[1],
								electric:numArr[2] 
							}
						}
						
					}else{ //旧型号蓝精灵
						let param = this.oldParamId
						if(param!=4){ //不为ORP
							record = {
								param:param,
								value:numArr[0],
								temperature:numArr[1],
								electric:param!=9?numArr[2]:numArr[4] 
							}
							if(param==9){
								record.mud = numArr[2]
								record.bod = numArr[3]
							}
						}else{ //ORP
							record = {
								param:param,
								value:numArr[0],
								electric:numArr[1]
							}
						}
					}
				}else{ //多功能传感器
					record = {
						temperature:numArr[0],
						val1:numArr[1],
						val2:numArr[2],
						val3:numArr[3],
						val4:numArr[4],
						val5:numArr[5],
						val6:numArr[6],
						val7:numArr[7],
						val8:numArr[8],
						electric:numArr[9],
					}
				}
				
				if(this.isFirstData){ //第一个花括号数据要存时间，时间总是在最后两位
					record.interval = numArr[numArr.length-2]
					record.testTime = numArr[numArr.length-1]
					this.isFirstData = false
				}
				console.log(record)
				getApp().globalData.valueArr.push(record)
				
			},
		


			
			
			// onBluetoothAdapterStateChange(){
			// 	uni.onBLEConnectionStateChange((res) => {
			// 		if(res.connected == false){
			// 			uni.showModal({
			// 				title: "蓝牙连接断开"
			// 			})
			// 		}
			// 	})
			// },
			
			// ArrayBuffer转16进制字符串
            ab2hex(buffer) {
                const hexArr = Array.prototype.map.call(
                    new Uint8Array(buffer),
                    function(bit) {
                        return ('00' + bit.toString(16)).slice(-2)
                    }
                )
                return hexArr.join('')
            },
			// 将16进制转成字符串
			hexCharCodeToStr(hexCharCodeStr) {
			    var trimedStr = hexCharCodeStr.trim();
			    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
			    var len = rawStr.length;
			    if (len % 2 !== 0) {
			        alert("存在非法字符!");
			        return "";
			    }
			    var curCharCode;
			    var resultStr = [];
			    for (var i = 0; i < len; i = i + 2) {
			        curCharCode = parseInt(rawStr.substr(i, 2), 16);
			        resultStr.push(String.fromCharCode(curCharCode));
			    }
			    return resultStr.join("");
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
