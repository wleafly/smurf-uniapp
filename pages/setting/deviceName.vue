<template>
	<view class="container">
		<input :placeholder="i18n('deviceName_input')" v-model="content" class="input">
		
		<text style="margin-left: 40rpx; font-size: 22rpx; color: #bdc3c7;">{{$t('deviceName_label')}}</text>
		<button @click="modify" class="btn">{{$t('deviceName_button')}}</button>
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
				messageHex:'',
				message:'',
				content:'',
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
			
				bytesToHexString(bytes) {
					return bytes.reduce((acc, value) => acc + value.toString(16).padStart(2, '0'), '');
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
					
					let buffer = this.stringToArrayBuffer(msg)
					console.log(buffer)
					
					let that = this
					
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
				        this.messageHex.value = resHex
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
					let pwd = '<pwd123456>'
					this.send(pwd)	//先发送密码
					
					let msg = '<' + this.content + '>'	//修改设备名称
					setTimeout(() => {
						this.send(msg)
					}, 4000);
					

				},
				//字符串转为ArrayBuffer
				stringToArrayBuffer(str) {
					let bytes = new Array();
				
					let len, c;
					len = str.length;
				
					for (let i = 0; i < len; i++) {
						c = str.charCodeAt(i);
				
						if (c >= 0x010000 && c <= 0x10ffff) {
							bytes.push(((c >> 18) & 0x07) | 0xf0);
							bytes.push(((c >> 12) & 0x3f) | 0x80);
							bytes.push(((c >> 6) & 0x3f) | 0x80);
							bytes.push((c & 0x3f) | 0x80);
						} else if (c >= 0x000800 && c <= 0x00ffff) {
							bytes.push(((c >> 12) & 0x0f) | 0xe0);
							bytes.push(((c >> 6) & 0x3f) | 0x80);
							bytes.push((c & 0x3f) | 0x80);
						} else if (c >= 0x000080 && c <= 0x0007ff) {
							bytes.push(((c >> 6) & 0x1f) | 0xc0);
							bytes.push((c & 0x3f) | 0x80);
						} else {
							bytes.push(c & 0xff);
						}
					}
					let array = new Int8Array(bytes.length);
				
					for (let i in bytes) {
							array[i] = bytes[i];
					}
					return array.buffer;
				},
			
		}
	}
</script>

<style lang="scss">
	page{
		background: #ecf0f1;	
	}
	
	.container{
		
	}
	
	.input{
		height: 80rpx;
		width: 90%;
		margin-top: 80rpx;
		margin-left: 40rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
	}
	
	.btn{
		margin-top: 100rpx;
		width: 60%;
		border-radius: 30rpx;
		margin-left: 150rpx;
	}
</style>

