<template>
	<view style="padding: 20rpx;">
		<view v-if="deviceArr.length==0" class="remind_connect">
			<loading txt="正在获取设备"></loading>
		</view>
		<view v-for="device,index in deviceArr" class="box">
			<!-- 单参数的情况,param在10以后的设备没有校准指令，暂时不显示 -->
			<view v-if="device.type==0 && device.param<10">
				<view class="row" style="padding-top: 20rpx;font-size: 35rpx;font-weight: bold;color: gray;">
					<view>{{paramArr[device.param]}}</view>
					<u-icon v-if="deviceArr.length>1" :name="formFlap[index]?'arrow-down':'arrow-up'"
						@click="showOrFlap(index)"></u-icon>
				</view>

				<view v-if="!formFlap[index]" style="border-top: 1rpx solid lightgray;margin-top: 20rpx;">
					<view class="row">
						<view>设备地址</view>
						<view style="width: 50%;">{{device.address}}</view>
						<view class="button" @click="alterAddress(device.address,index)">更改</view>
					</view>
					<view v-if="device.param!=4" class="row">
						<view>温度校准</view>
						<input type="number" class="input" v-model:value="temperatureArr[index]" placeholder="请输入实际温度"/>
						<view class="button" @click="adjustValue(device.address,temperatureArr[index],'温度')">写入</view>
					</view>
					<view v-if="device.param!=3" class="row">
						<view>零点校准</view>
						<input type="number" class="input" v-model:value="zeroArr[index]" />
						<view class="button" @click="adjustValue(device.address,zeroArr[index],'零点',device.param)">写入
						</view>
					</view>
					<view v-else class="row">
						<view>零点校准</view>
						<view style="width: 50%;">6.86</view>
						<view class="button" @click="adjustValue(device.address,'0','零点',device.param)">写入</view>
					</view>
					<view v-if="device.param!=3" class="row">
						<view>斜率校准</view>
						<input type="number" class="input" v-model:value="slopeArr[index]" />
						<view class="button" @click="adjustValue(device.address,slopeArr[index],'斜率',device.param)">写入
						</view>
					</view>
					<view v-else class="row">
						<view>斜率校准</view>
						<view class="button" @click="selectPH4=true"
							style="width: 25%;border: 1rpx solid lightgrey;color: black;"
							:style="selectPH4?'background-color: #ddd':'background-color: transparent;'">4.00</view>
						<view class="button" @click="selectPH4=false"
							style="width: 25%;border: 1rpx solid lightgrey;color: black;"
							:style="selectPH4?'background-color: transparent;':'background-color: #ddd'">9.18</view>
						<view class="button" @click="adjustValue(device.address,'0','斜率',device.param)">写入</view>
					</view>

					<view v-if="device.param==9">
						<view class="row" style="border-top: 1rpx solid #eee;padding-top: 20rpx;">
							<view>浊度零点校准</view>
							<input type="number" class="input" style="width: 40%;" v-model:value="mudZeroArr[index]" />
							<view class="button" @click="adjustValue(device.address,mudZeroArr[index],'浊度零点')">写入</view>
						</view>
						<view class="row">
							<view>浊度斜率校准</view>
							<input type="number" class="input" style="width: 40%;" v-model:value="mudSlopeArr[index]" />
							<view class="button" @click="adjustValue(device.address,mudSlopeArr[index],'浊度斜率')">写入
							</view>
						</view>
					</view>
				</view>


			</view>
			<!-- 多参数的情况 -->
			<view v-else-if="device.type==1">
				<view class="row"
					style="padding: 20rpx 0;font-size: 35rpx;font-weight: bold;color: gray;border-bottom: 1rpx solid lightgray;">
					<view>多参数</view>
				</view>
				<view class="row">
					<view>设备地址</view>
					<view style="width: 50%;">{{device.address}}</view>
					<view class="button" @click="alterAddress(device.address,index)">更改</view>
				</view>
				<view class="row">
					<view>温度校准</view>
					<input type="number" class="input" v-model:value="temperatureArr[index]" placeholder="请输入实际温度"/>
					<view class="button" @click="adjustValue(device.address,temperatureArr[index],'温度')">写入</view>
				</view>
				<view class="row">
					<view>参数选择</view>
					<picker class="input" @change="manyParamsBindChange" :range='manyParamsOptionArr'>
						<view style="display: flex;justify-content: space-between;">
							<view>{{manyParamsOption>=0?manyParamsOptionArr[manyParamsOption]:"请选择参数"}}</view><u-icon
								name="arrow-down"></u-icon>
						</view>
					</picker>
					<view class="button" style="background-color: transparent;"></view>
				</view>
				<view v-if="manyParamsOption!=3" class="row">
					<view>零点校准</view>
					<input type="number" class="input" v-model:value="zeroArr[index]" />
					<view class="button" @click="adjustManyParams(device.address,zeroArr[index],'零点')">写入</view>
				</view>
				<view v-else class="row">
					<view>零点校准</view>
					<view style="width: 50%;">6.86</view>
					<view class="button" @click="adjustValue(device.address,'0','零点',3)">写入</view>
				</view>
				<view v-if="manyParamsOption!=3" class="row">
					<view>斜率校准</view>
					<input type="number" class="input" v-model:value="slopeArr[index]" />
					<view class="button" @click="adjustManyParams(device.address,slopeArr[index],'斜率')">写入</view>
				</view>
				<view v-else class="row">
					<view>斜率校准</view>
					<view class="button" @click="selectPH4=true"
						style="width: 25%;border: 1rpx solid lightgrey;color: black;"
						:style="selectPH4?'background-color: #ddd':'background-color: transparent;'">4.00</view>
					<view class="button" @click="selectPH4=false"
						style="width: 25%;border: 1rpx solid lightgrey;color: black;"
						:style="selectPH4?'background-color: transparent;':'background-color: #ddd'">9.18</view>
					<view class="button" @click="adjustValue(device.address,'0','斜率',3)">写入</view>
				</view>

			</view>


		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				isNewDevice: getApp().globalData.isNewDevice,
				deviceArr: getApp().globalData.deviceArr,
				temperatureArr: [],
				zeroArr: [],
				slopeArr: [],
				mudZeroArr: [],
				mudSlopeArr: [],
				paramArr: getApp().globalData.paramArr,
				formFlap: [], //控制表单显示与折叠,false代表显示，所以默认都显示
				selectPH4: true, //校准ph时用的
				zeroAdjustArr: ["", "fe0606", "fe0606", "fe0608", "fe060a", "fe060c", "fe060e", "fe0610", "fe0606",
					"fe0602"
				], //零点校准的指令列表，索引和param对应
				slopeAdjustArr: ["", "fe0607", "fe0607", "fe0609", "fe060b", "fe060d", "fe060f", "fe0611", "fe0607",
					"fe0603"
				], //斜率校准的指令列表
				manyParamsOptionArr: ["COD", "COD内置浊度", "电导率", "pH", "ORP", "溶解氧", "铵氮/离子类", "浊度", "盐度"],
				manyParamsOption: -1,
				isShowLoading: true
			}
		},
		methods: {
			adjustManyParams(address, value, type) {
				let param = this.manyParamsOption
				if (param > -1) {
					if (param == 0) {
						this.adjustValue(address, value, type, 9) //manyParamsOptionArr第0位是cod
					} else if (param == 1) {
						this.adjustValue(address, value, "浊度" + type)
					} else {
						this.adjustValue(address, value, type, this.manyParamsOption)
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '请选择参数'
					})
				}

			},
			manyParamsBindChange(e) {
				console.log(e.detail.value)
				this.manyParamsOption = e.detail.value
			},
			showOrFlap(index) {
				this.$set(this.formFlap, index, !this.formFlap[index])
			},
			alterAddress(address, index) {
				let that = this
				uni.showModal({
					title: "提示",
					editable: true,
					placeholderText: "请输入新地址",
					success(res) {
						if (res.confirm) {
							let newAddress = parseInt(res.content)
							if (newAddress && newAddress > 0 && newAddress < 128) {
								// console.log('新地址',newAddress)
								//执行修改地址的逻辑
								let newAddress_hex = newAddress.toString(16).length < 2 ? '0' + newAddress
									.toString(16) : newAddress.toString(16)
								// console.log("转化为16进制后",newAddress_hex)
								let msg
								if (that.isNewDevice) { //新设备改地址指令格式是 f+新地址+旧地址
									let oldAddress_hex = address.toString(16).length < 2 ? '0' + address.toString(
										16) : address.toString(16)
									msg = 'f9' + newAddress_hex + oldAddress_hex
								} else { //老设备改地址指令格式是 f+新地址
									msg = 'f9' + newAddress_hex
								}
								console.log(msg)
								uni.showLoading({
									title: '更改中'
								})
								let alter_success = false //更改成功的标志
								setTimeout(() => {
									uni.hideLoading() //超时关闭加载
									if (!alter_success) {
										uni.showToast({
											title: "更改失败，请重新发送",
											icon: "none"
										})
									}
								}, 10000)
								//向蓝牙设备发送改地址指令
								getApp().writeValueToBle(msg, str => {
									console.log(str)
									if (str.search("[OK]") != -1) {
										uni.hideLoading() //主动关闭加载
										uni.showToast({
											title: "修改成功",
											icon: "none"
										})
										alter_success = true
										getApp().globalData.addressToParamMap[newAddress] = getApp()
											.globalData.addressToParamMap[that.deviceArr[index].address]
										that.deviceArr[index].address = newAddress
										getApp().globalData.firstLoading = true
									}
									// if(str.search("[Error]")!=-1){
									// 	uni.hideLoading()  //主动关闭加载
									// 	uni.showToast({
									// 		title:"更改失败，请重新发送",
									// 		icon:"none"
									// 	})
									// }
								})

							} else {
								uni.showToast({
									icon: 'none',
									title: '请输入1~127之间的数'
								})
							}
						}

					}
				})

			},
			adjustValue(address, value, type, param) {
				if (!value) {
					uni.showToast({
						icon: 'none',
						title: '请输入值'
					})
					return
				}
				console.log('地址', address, '数值', value, '类型',type, '参数', param?param:'没传')
				if (parseInt(value) >= 0 && parseInt(value) < 65536) {
					if(type=='温度'){ //温度要乘10,写入设备的值是用户输入的10倍
						if(value>80){
							uni.showToast({
								icon:'none',
								title:'温度超出使用范围'
							})
							return
						}else{
							value = value*10
						}
					}
					let value_hex = parseInt(value).toString(16)
					let msg = ""
					let value_hex_limit4 = "0000".slice(0, 4 - value_hex.length) + value_hex
					console.log()
					if(this.deviceArr[0].type == 1){ //多参数校准指令头
						console.log("使用多参数指令")
						switch (type) {
							case '温度':
								msg = "fe0600"
								break
							case '零点':
								msg = this.zeroAdjustArr[param]
								break
							case '斜率':
								msg = this.slopeAdjustArr[param]
								break
							case '浊度零点':
								msg = "fe0604"
								break
							case '浊度斜率':
								msg = "fe0605"
								break
						}
					}else{ //单参数校准指令头
						console.log("使用单参数指令")
						switch (type) {
							case '温度':
								msg = "fe0610"
								break
							case '零点':
								msg = "fe0600"
								break
							case '斜率':
								msg = "fe0604"
								break
							case '浊度零点':
								msg = "fe0620"
								break
							case '浊度斜率':
								msg = "fe0624"
								break
						}
					}

					msg += value_hex_limit4
					if (this.deviceArr.length>1) { //新设备单参数可能接多支，所以指令后面要加地址
						msg += address.toString(16).length < 2 ? '0' + address.toString(16) : address.toString(16)
					}
					console.log(msg) //以后替换成向蓝牙发送的逻辑
					uni.showLoading({
						title: '校准中'
					})
					let alter_success = false //更改成功的标志
					let get_error = false //是否手动[Error]
					setTimeout(() => {
						if (!alter_success && !get_error) {
							uni.hideLoading() //超时关闭加载
							uni.showToast({
								title: "校准失败，请重新发送",
								icon: "none"
							})
						}
					}, 10000)
					getApp().writeValueToBle(msg, str => {
						// console.log(str)
						getApp().handleStrFromBlueTooth(str) 
						if (str.search("[OK]") != -1) {
							uni.hideLoading() //主动关闭加载
							uni.showToast({
								title: "校准成功",
								icon: "none"
							})
							alter_success = true
							//校准成功后，数据会中断，所以立刻发起f900
							getApp().writeValueToBle('F900',(str)=>{
								getApp().globalData.firstLoading = false 
								getApp().handleStrFromBlueTooth(str)
							})
							
							// getApp().globalData.firstLoading = true
						}
						if(str.search("[Error]")!=-1){
							get_error = true
							uni.hideLoading()  //主动关闭加载
							uni.showToast({
								title: "校准失败，请重新发送",
								icon: "none"
							})
						}
					})

				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入0~65535之间的数'
					})
				}
			}

		},
		onLoad() {
			if (getApp().globalData.deviceCoreData.deviceId) {
				let that = this
				uni.getConnectedBluetoothDevices({ //获取处于已连接状态的设备
					success(res) {
						let isConnect = false
						for (let device of res.devices) {
							if (device.deviceId == getApp().globalData.deviceCoreData.deviceId) {
								isConnect = true
							}
						}
						if (isConnect) {
							if(that.deviceArr.length==0){ 
								getApp().writeValueToBle('F900',(str)=>{
									getApp().globalData.firstLoading = false  //这里发起f900后，数据页就不要发了
									getApp().handleStrFromBlueTooth(str)
								})
							}
						} else {
							uni.showModal({
								content: '设备连接已断开，请重新连接',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.navigateBack()
									}
								}
							})
						}
					}
				})
			} else {
				uni.showModal({
					content: '设备未连接',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							// uni.navigateBack()
						}
					}
				})
			}
			// if(this.deviceArr.length)


			// this.deviceArr = [{
			// 		address: 3,
			// 		type: 0,
			// 		param: 9 //COD 
			// 	},
			// 	{
			// 		address: 6,
			// 		type: 0,
			// 		param: 6 //ION,一般情况
			// 	},
			// 	{
			// 		address: 7,
			// 		type: 0,
			// 		param: 4 //ORP，不带温度
			// 	},
			// 	{
			// 		address: 8,
			// 		type: 0,
			// 		param: 3 //pH，斜率校准用按钮
			// 	}
			// ]

			// this.deviceArr=[
			// 	{
			// 		address:3,
			// 		type:1,//多参数假数据
			// 		param:4
			// 	}
			// ]
		}
	}
</script>

<style>
	page {
		background-color: #EFEFEF;
	}

	.button {
		background-color: #89B7EC;
		color: white;
		border-radius: 10rpx;
		padding: 10rpx 0;
		width: 20%;
		text-align: center;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	}

	.box {
		background-color: white;
		border-radius: 20rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
	}

	.input {
		width: 50%;
		border: 1px solid lightgrey;
		border-radius: 5rpx;
		padding: 10rpx
	}

	.remind_connect {
		height: 800rpx;
		color: #acacac;
		font-size: 40rpx;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}
</style>