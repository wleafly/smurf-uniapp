<template>
	<view class="outer">
		<input :placeholder="i18n('deviceName_input')" v-model="content" class="input">

		<text style="margin-left: 10rpx; font-size: 22rpx; color: #bdc3c7;">{{$t('deviceName_label')}}</text>
		<button @click="modify" class="btn">{{$t('deviceName_button')}}</button>
	</view>

</template>

<script>
	export default {
		data() {
			return {

				// messageHex: '',
				// message: '',
				content: '',
			}
		},
		onShow() {

		},
		methods: {
			//为控件的属性动态绑定内容
			i18n(key) {
				return this.$i18n.messages[this.$i18n.locale][key]
			},

			// //通过蓝牙向设备发送数据
			// send(msg) {
			// 	let buffer = this.stringToArrayBuffer(msg)
			// 	// console.log(buffer)
			// 	let that = this
				
			// 	uni.writeBLECharacteristicValue({
			// 		deviceId: this.deviceId,
			// 		serviceId: this.serviceId,
			// 		characteristicId: this.writeCharacteristicId,
			// 		value: buffer,
			// 		success(res) {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: "数据发送成功"
			// 			})
			// 			// console.log(res)
			// 			console.log("数据发送成功")
			// 			that.listenValueChange()
			// 		},
			// 		fail(err) {
			// 			console.error(err)
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: "数据发送失败"
			// 			})
			// 			console.log("数据发送失败")
			// 		}
			// 	})
			// },
			// //监听数据变化
			// listenValueChange() {
			// 	let res2 = {
			// 		categories: this.categories2,
			// 		series: this.series2,
			// 	};
			// 	let that = this
			// 	uni.onBLECharacteristicValueChange(res => {
			// 		let resHex = this.ab2hex(res.value)
			// 		this.messageHex.value = resHex
			// 		console.log('resHex', resHex)
			// 		let result = this.hexCharCodeToStr(resHex)
			// 		console.log(result)
			// 		result = String(result)

			// 	})
			// },
			
			
			modify() {
				if(this.content.trim()){  //输入框不为空串，就弹窗提示是否要改名
					let that = this
					uni.showModal({
						content:"是否要将设备名修改为"+that.content,
						success(res) {
							if(res.confirm){
								if(that.content.length <3){
									uni.showToast({
										icon:'none',
										title:"名称过短"
									})
								}else if( that.content.length>18){
									uni.showToast({
										icon:'none',
										title:"名称过长"
									})
								}else {
									// let pwd = '<pwd123456>'
									let msg = '<' + that.content + '>' //修改设备名称
									console.log('要改的名字是:'+msg)
									
									getApp().writeBufferToBle(that.stringToArrayBuffer(msg),str=>{
										console.log(str)
									})
								}
							}
						}
					})
				}else{
					console.log("是空串")
				}
				
				

				
				
				// this.send(pwd) //先发送密码
				

				// let msg = '<' + this.content + '>' //修改设备名称
				// setTimeout(() => {
				// 	this.send(msg)
				// }, 4000);


			},

			//字符串转为ArrayBuffer,好像比全局里面的那个特殊一点
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
	page {
		background: #ecf0f1;
	}

	.outer {
		padding: 30rpx;
	}

	.input {
		height: 80rpx;
		margin-bottom: 0;
		margin-top: 30rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 0 20rpx;
	}

	.btn {
		margin-top: 50rpx;
		width: 80%;
		border-radius: 20rpx;
		background-color: skyblue;
		color: white;
		font-weight: bold;

	}
</style>