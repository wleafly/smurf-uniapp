<template>
	<view>
		<view class="gif">
			<image src="../../static/loading_gif.gif"></image>
		</view>
		
		<u-loading-icon mode="semicircle" text="半圆"></u-loading-icon>
		<view>
			<!-- 提示窗 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" :content="content"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				deviceId:'',
				serviceId:'',
				notifyCharacteristicId:'',
				writeCharacteristicId:'',
				state:0,
				type: 'center',
				msgType: 'success',
				count:0,
				content:'',
				str:'',
			}
		},
		onShow() {
			this.deviceId=getApp().globalData.deviceCoreData.deviceId
			this.serviceId=getApp().globalData.deviceCoreData.serviceId
			this.notifyCharacteristicId=getApp().globalData.deviceCoreData.notifyCharacteristicId
			this.writeCharacteristicId=getApp().globalData.deviceCoreData.writeCharacteristicId
			this.check()
		},
		methods: {
			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				console.log('点击确认')
			},
			dialogClose() {
				console.log('点击关闭')
			},
			showModal() {
				uni.showLoading({
					title: '加载中',
				})
				setTimeout(() => {
					uni.hideLoading()
					this.dialogToggle('success')
				},3000)
			},
			check(){
				let msg = 'F900'
				uni.showLoading({
					title: '加载中',
				})
				this.send(msg)
				setTimeout(() => {
					if(this.state == 0){
						this.send('FA')
					}
				},11000)
				setTimeout(() => {
					if(this.state == 0){
						uni.showToast({
							title: '数据通信不通畅，请重启设备',
							duration: 3000
						})
						uni.hideLoading()
						this.content = '数据通信不通畅，请检查传感器连接，并重启设备'
						this.dialogToggle('success')
						console.log('数据通信不通畅，请检查传感器连接，并重启设备')
						
					}
				},7000)
			},
			//通过蓝牙向设备发送数据
			send(msg){
				var typedArray = new Uint8Array(msg.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16)
					}))
				var buffer = typedArray.buffer
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
				let that = this
			    uni.onBLECharacteristicValueChange(res => {
			        let resHex = this.ab2hex(res.value)
					
			        let result = this.hexCharCodeToStr(resHex)
					console.log(result)
					
					if(result.charAt(0) == '[' && result.charAt(1) >= '0'){
						this.state = 1
						uni.hideLoading()
						console.log('数据通信正常')
						this.content = '数据通信正常'
						this.dialogToggle('success')
					}else if(result.charAt(0) == '{' && this.state == 0 && this.count == 2){
						console.log('F900正常，FA不正常')
						
						if(result.charAt(result.length-1)!='}'){ //数据过长，对数据进行拼接
							this.str = ''
							this.str = this.str + result
						}else if(result.charAt(0)!='{' && result.charAt(result.length-1)=='}'){ //第一位不是'{',且最后一位是'}'
							this.str = this.str + result
							this.str = this.str.slice(1,this.str.length-1)
							this.str = this.str.split(',')
							console.log(this.str)
						}else{
							result = result.slice(1,result.length-1)
							result = result.split(',')
							this.str = result
							console.log(this.str)
						}
						
						if(Number(this.str[this.str.length-2])<3.4){
							uni.hideLoading()
							this.content = '电池电量过低，请充电'
							this.dialogToggle('success')
							return
						}
						uni.hideLoading()
						this.content = 'F900正常，FA不正常'
						this.dialogToggle('success')
						
					}else{
						this.count += 1
					}
					
					result = String(result)
			    })
			},
			onBluetoothAdapterStateChange(){
				uni.onBLEConnectionStateChange((res) => {
					if(res.connected == false){
						// uni.showModal({
						// 	title: "蓝牙连接断开"
						// })
						console.log("蓝牙连接断开")
					}
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
		}
	}
</script>

<style>
	.gif{
		flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
	}
</style>