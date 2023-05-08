<template>
	<view class="container">
		<view class="input_container">
			<view class="row" style="margin: 25rpx;" >
				<text style="width: 200rpx;">{{$t('intervalTime')}}</text>
				<input :placeholder="i18n('interval_input')" v-model="intervals" class="input" style="">
			</view>
			<view style="height: 12rpx; border-bottom: 1px solid gray; width: 90%; margin-left: 35rpx;"></view>
			<view class="row" style="margin: 25rpx;">
				<text style="width: 200rpx;">{{$t('testTime')}}</text>
				<input :placeholder="i18n('test_input')" v-model="testTime" class="input">
			</view>
		</view>
		<button class="btn" @click="modify">{{$t('write_button')}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId:'',
				serviceId:'',
				notifyCharacteristicId:'',
				writeCharacteristicId:'',
				intervals:0,
				testTime:0,
				
			}
		},
		onShow(){
			this.deviceId=getApp().globalData.deviceCoreData.deviceId
			this.serviceId=getApp().globalData.deviceCoreData.serviceId
			this.notifyCharacteristicId=getApp().globalData.deviceCoreData.notifyCharacteristicId
			this.writeCharacteristicId=getApp().globalData.deviceCoreData.writeCharacteristicId
		},
		methods: {
			//为控件的属性动态绑定内容
			i18n(key) {
			    return this.$i18n.messages[this.$i18n.locale][key]
			},
			// 启用 notify 功能
			notifyBLECharacteristicValueChange(){
				let that = this
				uni.notifyBLECharacteristicValueChange({
				  state: true, // 启用 notify 功能
				  deviceId:this.deviceId,
				  serviceId:this.serviceId,
				  characteristicId:this.notifyCharacteristicId,
				  success:(res)=> {
					console.log("启动notify功能成功")
				  },
				  fail:(res)=> {
					console.log('fail', res.errMsg)
				  }
				})
			},
			//通过蓝牙向设备发送数据
			send(msg){
				
				var typedArray = new Uint8Array(msg.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16)
					}))
				var buffer = typedArray.buffer
				
				let that = this
				console.log('deviceId是',this.deviceId)
				console.log('serviceId是',this.serviceId)
				console.log('characteristicId是',this.writeCharacteristicId)
				
				uni.writeBLECharacteristicValue({
					deviceId:this.deviceId,
					serviceId:this.serviceId,
					characteristicId:this.writeCharacteristicId,
					value:buffer,
					success(res) {
						uni.showToast({icon:'none',title: "数据发送成功"})
						// console.log(res)
						console.log("数据发送成功")
						that.listenValueChange()
					},
					fail(err) {
						console.error(err)
						uni.showToast({icon:'none',title: "数据发送失败"})
						console.log("数据发送失败")
					}
				})
			},
			//监听数据变化
			listenValueChange() {
				let res2 = {
					categories: this.categories2,
					series: this.series2,
				};
				let that = this
				uni.onBLECharacteristicValueChange(res => {
					let resHex = this.ab2hex(res.value)
					// this.messageHex.value = resHex
					console.log('resHex',resHex)
					let result = this.hexCharCodeToStr(resHex)
					console.log(result)
					result = String(result)
					
				})
			},
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
			},		
			
			modify(){
				//将时间转为FC xx xx的十六进制格式
				let intervals_hex = Number(this.intervals).toString(16)
				if(intervals_hex.length<2){
					intervals_hex = '0'+intervals_hex
				}
				let testTime_hex = Number(this.testTime).toString(16)
				if(testTime_hex.length<2){
					testTime_hex = '0'+testTime_hex
				}
				let msg = 'FC'+intervals_hex+testTime_hex
				
				this.send(msg)
			},
		}
	}
</script>

<style>
	page{
		background: #ecf0f1;	
	}
	
	.row{
		display: flex;
		flex-direction: row;
	}
	
	.input{
		/* height: 80rpx; */
		width: 90%;
		background-color: #ffffff;
		border-radius: 30rpx;
	}
	
	.container {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	  }
	  
	.input_container{
		height: 200rpx;
		width: 90%;
		margin-top: 30rpx;
		border-radius: 30rpx;
		background-color: #ffffff;
	}
	
	.btn{
		margin-top: 100rpx;
		width: 60%;
		border-radius: 30rpx;
		margin-left: 150rpx;
	}
</style>