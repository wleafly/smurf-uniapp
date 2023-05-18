<template>
	<view class="container">
		
		<view class="input_container">
			<view class="row" style="margin: 25rpx;" >
				<text style="width: 170rpx;">{{$t('deviceAddress')}}</text>
				<input :placeholder="i18n('address_input')" v-model="deviceAddress" class="input" style="">
			</view>
			<view class="line" style="margin-top: 40rpx;"></view>
			<view class="row" style="margin: 25rpx;">
				<text style="width: 170rpx;">{{$t('temp')}}</text>
				<input :placeholder="i18n('temp_input')" v-model="temp_calibration" class="input">
				<button class="btn_write" @click="temp_modify">{{$t('write_button')}}</button>
			</view>
		</view>
		
		<view v-show="param=='0' && typeId!='3'" class="input_container">
			<view class="row" style="margin: 30rpx; height: 50rpx;">
				<text style="width: 240rpx;">{{$t('zero')}}</text>
				<input :placeholder="i18n('zero_input')" v-model="zero_calibration" class="input" style="">
				<button class="btn_write" @click="zero_modify">{{$t('write_button')}}</button>
			</view>
			<view class="line"></view>
			<view class="row" style="margin: 25rpx;">
				<text style="width: 240rpx;">{{$t('slope')}}</text>
				<input :placeholder="i18n('slope_input')" v-model="slope_calibration" class="input">
				<button class="btn_write" @click="slope_modify">{{$t('write_button')}}</button>
			</view>
		</view>
		
		<view v-show="typeId=='3'" class="input_container">
		<!-- <view class="input_container"> -->
			<view class="row" style="margin: 30rpx; height: 50rpx;">
				<text style="width: 240rpx;">{{$t('zero')}}</text>
				<text @click="show_pH_zero = true">{{pH_zero}}</text>
				<button class="btn_write" style="margin-left: 200rpx; width: 165rpx;" @click="zero_modify">{{$t('write_button')}}</button>
			</view>
			<view class="line"></view>
			<view class="row" style="margin: 25rpx;">
				<text style="width: 240rpx;">{{$t('slope')}}</text>
				<text  @click="show_pH_slope = true">{{pH_slope}}</text>
				<button class="btn_write" style="margin-left: 200rpx; width: 165rpx;" @click="slope_modify">{{$t('write_button')}}</button>
			</view>
		</view>
		
		<view v-show="typeId=='9'" class="input_container" style="height: 280rpx;">
			<view style="margin: 20rpx;">{{$t('COD_ZS')}}</view>
			<view class="row" style="margin: 25rpx; height: 50rpx;" >
				<text style="width: 240rpx;">{{$t('zero')}}</text>
				<input :placeholder="i18n('zero_input')" v-model="COD_zero_calibration" class="input" style="">
				<button class="btn_write" @click="COD_zero_modify">{{$t('write_button')}}</button>
			</view>
			<view class="line"></view>
			<view class="row" style="margin: 25rpx;">
				<text style="width: 240rpx;">{{$t('slope')}}</text>
				<input :placeholder="i18n('slope_input')" v-model="COD_slope_calibration" class="input">
				<button class="btn_write" @click="COD_slope_modify">{{$t('write_button')}}</button>
			</view>
		</view>
		
		<!-- 多参数 -->
		<view v-show="param=='1'" class="input_container" style="margin: 25rpx; height: 340rpx;">
			<view class="row" style="margin: 25rpx; height: 50rpx;" @click="show = true" >
				<text style="width: 140rpx;">{{$t('calibrationSelection')}}</text>
				<text>{{mul_text}}</text>
			</view>
			<view class="line"></view>
			<view class="row" style="margin: 25rpx; height: 50rpx;" >
				<text style="width: 240rpx;">{{$t('zero')}}</text>
				<input :placeholder="i18n('zero_input')" v-model="mul_zero_calibration" class="input" style="">
				<button class="btn_write" @click="mul_zero_modify">{{$t('write_button')}}</button>
			</view>
			<view class="line"></view>
			<view class="row" style="margin: 25rpx;  height: 50rpx;">
				<text style="width: 240rpx;">{{$t('slope')}}</text>
				<input :placeholder="i18n('slope_input')" v-model="mul_slope_calibration" class="input">
				<button class="btn_write" @click="mul_slope_modify">{{$t('write_button')}}</button>
			</view>
		</view>
		
		<u-picker :show="show" :columns="columns" @confirm="confirm" @cancel="cancel"></u-picker>
		<u-picker :show="show_pH_zero" :columns="columns_pH_zero" @confirm="confirm_pH_zero" @cancel="cancel"></u-picker>
		<u-picker :show="show_pH_slope" :columns="columns_pH_slope" @confirm="confirm_pH_slope" @cancel="cancel"></u-picker>
		<view>
			<!-- 提示窗 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" :cancelText="i18n('cancel')" content="i18n('successful')"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceAddress:'',
				typeId:'',
				param:'',
				deviceId:'',
				serviceId:'',
				notifyCharacteristicId:'',
				writeCharacteristicId:'',
				zero_calibration:'',
				slope_calibration:'',
				COD_zero_calibration:'',
				COD_slope_calibration:'',
				mul_zero_calibration:'',
				mul_slope_calibration:'',
				pH_zero:'6.86',
				pH_slope:'4.00',
				temp_calibration:'',
				type: 'center',
				msgType: 'success',
				mul_text:'COD',
				
				show: false,
                columns: [
                    ['COD', '浊度(COD)', '电导率','pH','ORP','溶解氧','铵氮/离子类','浊度','盐度','余氯','叶绿素','蓝绿藻','透明度','悬浮物','水中油']
                ],
				
				show_pH_zero:false,
				columns_pH_zero: [
				    ['6.86']
				],
				
				show_pH_slope:false,
				columns_pH_slope: [
				    ['4.00','9.18']
				],
			}
		},
		onShow(){
			// let that = this
			// this.deviceId=getApp().globalData.deviceCoreData.deviceId
			// this.serviceId=getApp().globalData.deviceCoreData.serviceId
			// this.notifyCharacteristicId=getApp().globalData.deviceCoreData.notifyCharacteristicId
			// this.writeCharacteristicId=getApp().globalData.deviceCoreData.writeCharacteristicId
			// uni.getStorage({
			// 	key:'device',
			// 	success(res) {
			// 		that.deviceAddress = res.data.deviceAddress
			// 		that.typeId = res.data.typeId
			// 		that.param = res.data.param
			// 		// console.log(that.typeId)
			// 	},fail(err) {
					
			// 	}
			// })
		},
		methods: {
			//为控件的属性动态绑定内容
			i18n(key) {
			    return this.$i18n.messages[this.$i18n.locale][key]
			},
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
			confirm(e){
				this.mul_text = e.value[0]
				this.show = false
			},
			confirm_pH_zero(e){
				this.pH_zero = e.value[0]
				this.show_pH_zero = false
			},
			confirm_pH_slope(e){
				this.pH_slope = e.value[0]
				this.show_pH_slope = false
			},
			cancel(e){
				this.show = false
				this.show_pH_zero = false
				this.show_pH_slope = false
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
						if(result == '[OK]'){
							console.log('修改成功')
							this.dialogToggle('success')
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
				
				temp_modify(){	
					//将时间转为十六进制格式
					let temp_calibration_hex = Number(this.temp_calibration).toString(16)
					if(temp_calibration_hex.length==1){
						temp_calibration_hex = '000'+temp_calibration_hex
					}else if(temp_calibration_hex.length==2){
						temp_calibration_hex = '00'+temp_calibration_hex
					}else if(temp_calibration_hex.length==3){
						temp_calibration_hex = '0'+temp_calibration_hex
					}
					if(this.param=='1'){
						let msg = 'FE0600'+temp_calibration_hex
						console.log(msg)
						this.send(msg)
					}else{
						let msg = 'FE0610'+temp_calibration_hex
						console.log(msg)
						this.send(msg)
					}
					
				},
				
				zero_modify(){
					//将时间转为十六进制格式
					let zero_calibration_hex = Number(this.zero_calibration).toString(16)
					if(zero_calibration_hex.length==1){
						zero_calibration_hex = '000'+zero_calibration_hex
					}else if(zero_calibration_hex.length==2){
						zero_calibration_hex = '00'+zero_calibration_hex
					}else if(zero_calibration_hex.length==3){
						zero_calibration_hex = '0'+zero_calibration_hex
					}
					let msg = 'FE0600' + zero_calibration_hex
					console.log(msg)
					this.send(msg)
				},
				
				slope_modify(){
					//将时间转为十六进制格式
					let slope_calibration_hex = Number(this.slope_calibration).toString(16)
					if(slope_calibration_hex.length==1){
						slope_calibration_hex = '000'+slope_calibration_hex
					}else if(slope_calibration_hex.length==2){
						slope_calibration_hex = '00'+slope_calibration_hex
					}else if(slope_calibration_hex.length==3){
						slope_calibration_hex = '0'+slope_calibration_hex
					}
					let msg = 'FE0604' + slope_calibration_hex
					console.log(msg)
					this.send(msg)
				},
				
				pH_zero_modify(){
					//将时间转为十六进制格式
					if(pH_zero == '6.86'){
						let msg = 'FE06000000'
						console.log(msg)
						this.send(msg)
					}
				},
				pH_slope_modify(){
					if(pH_slope == '4.00'){
						let msg = 'FE06020000'
						console.log(msg)
						this.send(msg)
					}
				},
				
				COD_zero_modify(){
					let COD_zero_calibration_hex = Number(this.COD_zero_calibration).toString(16)
					if(COD_zero_calibration_hex.length==1){
						COD_zero_calibration_hex = '000'+COD_zero_calibration_hex
					}else if(COD_zero_calibration_hex.length==2){
						COD_zero_calibration_hex = '00'+COD_zero_calibration_hex
					}else if(COD_zero_calibration_hex.length==3){
						COD_zero_calibration_hex = '0'+COD_zero_calibration_hex
					}
					let msg = 'FE0620'+COD_zero_calibration_hex
					this.send(msg)
				},
				COD_slope_modify(){
					let COD_slope_calibration_hex = Number(this.COD_slope_calibration).toString(16)
					if(COD_slope_calibration_hex.length==1){
						COD_slope_calibration_hex = '000'+COD_slope_calibration_hex
					}else if(COD_slope_calibration_hex.length==2){
						COD_slope_calibration_hex = '00'+COD_slope_calibration_hex
					}else if(COD_slope_calibration_hex.length==3){
						COD_slope_calibration_hex = '0'+COD_slope_calibration_hex
					}
					let msg = 'FE0624'+COD_slope_calibration_hex
					this.send(msg)
				},
				mul_zero_modify(){
					let mul_zero_calibration_hex = Number(this.mul_zero_calibration).toString(16)
					if(mul_zero_calibration_hex.length==1){
						mul_zero_calibration_hex = '000'+mul_zero_calibration_hex
					}else if(mul_zero_calibration_hex.length==2){
						mul_zero_calibration_hex = '00'+mul_zero_calibration_hex
					}else if(mul_zero_calibration_hex.length==3){
						COD_zerocalibration_hex = '0'+mul_zero_calibration_hex
					}
					
					if(this.mul_text == 'COD'){
						let msg = 'FE0602'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '浊度(COD)'){
						let msg = 'FE0604'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '电导率'){
						let msg = 'FE0606'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == 'pH'){
						let msg = 'FE0608'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == 'ORP'){
						let msg = 'FE060A'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '溶解氧'){
						let msg = 'FE060C'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '铵氮/离子类'){
						let msg = 'FE060E'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '浊度'){
						let msg = 'FE0610'+mul_zero_calibration_hex
						console.log(msg)
						this.send(msg)
					}
				},
				mul_slope_modify(){
					let mul_slope_calibration_hex = Number(this.mul_slope_calibration).toString(16)
					if(mul_slope_calibration_hex.length==1){
						mul_slope_calibration_hex = '000'+mul_slope_calibration_hex
					}else if(mul_slope_calibration_hex.length==2){
						mul_slope_calibration_hex = '00'+mul_slope_calibration_hex
					}else if(mul_slope_calibration_hex.length==3){
						mul_slope_calibration_hex = '0'+mul_slope_calibration_hex
					}
					
					if(this.mul_text == 'COD'){
						let msg = 'FE0603'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '浊度(COD)'){
						let msg = 'FE0605'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '电导率'){
						let msg = 'FE0607'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == 'pH'){
						let msg = 'FE0609'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == 'ORP'){
						let msg = 'FE060B'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '溶解氧'){
						let msg = 'FE060D'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '铵氮/离子类'){
						let msg = 'FE060F'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}else if(this.mul_text == '浊度'){
						let msg = 'FE0611'+mul_slope_calibration_hex
						console.log(msg)
						this.send(msg)
					}
				}
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
		width: 50%;
		background-color: #ffffff;
	}
	
	.container {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	  }
	  
	.input_container{
		height: 220rpx;
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
	
	.btn_write{
/* 		width: 200rpx;
		height: 60rpx;
		margin-bottom: 30rpx; */
	}
	
	.line{
		height: 1rpx;
		border-top: 1px solid gray; 
		width: 90%; 
		margin-left: 35rpx;
	}
</style>