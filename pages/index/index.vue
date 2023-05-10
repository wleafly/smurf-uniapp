<template>
	<view class="outer">
		<!-- web下背景无效 -->
		<image class="bg-img" src="/static/background.jpg"></image> 
		<!-- 修改时间的弹窗 -->
		<uni-popup ref="popup" type="dialog">
			<view class="alter_time_view">
				<view style="margin-top: 20rpx;color: gray;">时间校准</view>
				<input type="text" v-model:value="interval_input" placeholder="请输入间隔时间" class="input_style"
					style="margin-top: 20rpx;" />
				<input type="text" v-model:value="testTime_input" placeholder="请输入测试时间" class="input_style"
					style="margin: 20rpx;" />
				<view class="btn_group">
					<view style="border-right: 1rpx solid #eee;width: 50%;text-align: center;" @click="close_popup()">取消
					</view>
					<view style="width: 50%;text-align: center;color: #007AFF" @click="confirm_alter_time()">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<view style="display: flex;flex-direction: row;align-items: center;">
			<view class="head">{{deviceArr.length>1?'多设备':(deviceArr.length==1?(deviceArr[0].type==1?'多参数':paramArr[deviceArr[0].param]):'未连接')}}</view>
			<view>
				<text style="text-align: center;font-size: 40rpx;color: #ffffff;font-weight: bold;text-shadow: 2px 2px 1px #737373;">deviceName</text>
				
				<view @click="sendF900()" style="background-color: #55ff7f;color: white;font-weight: bold;padding: 15rpx;border-radius: 10rpx;width: 200rpx;text-align: center;">开始接收数据</view>
			</view>
			<view class="flex_row_between" style="margin-top: 25rpx;justify-content: center;align-items: center;">
				<view class="battery" style="display: inline-block;">
					<view style="z-index: 1;position: relative;">{{eq}}</view>
					<view :style="{'width': eq+'%','background-color': batteryColor}" style="z-index: 0;position: relative;bottom:50rpx;height: 100%;border-radius: 10rpx;"></view>
				</view>
				<view style="background-color: white;width: 10rpx;height: 30rpx;border-top-right-radius: 10rpx;border-bottom-right-radius: 10rpx;"></view>
			</view>
		</view>
		<view class="element_style flex_row_between" style="margin: 15rpx;">
			<view class="time_style" style="border-right: 1rpx solid lightgray;" @click="toAlterTime()">间隔时间{{valueArr[index_with_time]?': '+valueArr[index_with_time].interval+'min':''}}</view>
			<view class="time_style" @click="toAlterTime()">测试时间{{valueArr[index_with_time]?': '+valueArr[index_with_time].testTime+'min':''}}</view>
		</view>
		
		<view v-if="deviceArr[0]">
			<view v-if="deviceArr[0].type!=1">
				<view v-for="device,index in deviceArr" class="chart_view" :key="index">
					<view class="flex_row_between" style="padding: 10rpx 30rpx">
						<view class="flex_row_between" style="width: 80%;">
							<view  @click="switchChart(index,0)" :style="lightOptions[index]==0?'color: #2D9AFF':''">{{paramArr[device.param]}}</view>
							<view>{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().value:""}}{{unitArr[device.param]}}</view>
						</view>
						<image v-if="deviceArr.length!=0" :src="chartDisplay[index]?'../../static/折叠.png':'../../static/展开.png'" @click="showOrFold(index)" style="width: 50rpx;height: 50rpx"></image>
					</view>
					
					<view v-if="chartDisplay[index]">
						<view class="flex_row_between" style="padding: 10rpx 30rpx;border-top: 1px solid lightgray;;">
							<view class="flex_row_between" style="width: 80%;">
								<view style="color: gray;">地址：{{device.address}}</view>
								<view v-if="device.param!=4"  @click="switchChart(index,1)"><text :style="lightOptions[index]==1?'color: #2D9AFF':''">温度</text>：{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().temperature:""}}℃</view>
							</view>
						</view>
						
						<view v-if="device.param==9" class="flex_row_between" style="padding: 10rpx 30rpx">
							<view class="flex_row_between" style="width: 80%;">
								<view @click="switchChart(index,2)" ><text :style="lightOptions[index]==2?'color: #2D9AFF':''">浊度</text>：{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().mud:""}}NTV</view>
								<view @click="switchChart(index,3)" ><text :style="lightOptions[index]==3?'color: #2D9AFF':''">BOD</text>：{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().bod:""}}mg/L</view>
							</view>
						</view>
						
						<qiun-data-charts  class="chart_style" type="line" :chartData="chartDataArr[index]" :opts="opts" :ontouch="true"/>
					</view>
				
				</view>
				
			</view>
			
			<!-- 多参数类型 -->
			<view v-else>
				<view class="element_style" style="margin: 15rpx;padding: 20rpx 10rpx;">
					<view class="row" style="margin-bottom: 20rpx;">
						<view class="item">化学需氧量(COD)<br>{{valueArr.length?valueArr[valueArr.length-1].val1:''}}</view>
						<view class="item">浊度(COD)<br>{{valueArr.length?valueArr[valueArr.length-1].val2:''}}</view>
						<view class="item">电导率/盐度<br>{{valueArr.length?valueArr[valueArr.length-1].val3:''}}</view>
						<view style="width: 25%;padding:0rpx 30rpx;line-height: 60rpx;font-size: 25rpx;">PH<br>{{valueArr.length?valueArr[valueArr.length-1].val4:''}}</view>
					</view>
					<view class="row">
						<view class="item">ORP<br>{{valueArr.length?valueArr[valueArr.length-1].val5:''}}</view>
						<view class="item">溶解氧<br>{{valueArr.length?valueArr[valueArr.length-1].val6:''}}</view>
						<view class="item">铵氮/离子类<br>{{valueArr.length?valueArr[valueArr.length-1].val7:''}}</view>
						<view style="width: 25%;padding:0rpx 30rpx;line-height: 60rpx;font-size: 25rpx;">浊度<br>{{valueArr.length?valueArr[valueArr.length-1].val8:''}}</view>
					</view>
				</view>
			</view>
				
		</view>
		<!-- 未连接设备时显示 -->
		<view v-else class="remind_connect">
			<icon type="info" size="50" color="#acacac"></icon>
			
			<view style="margin-top: 15rpx;">请连接设备</view>
			
		</view>
		

	</view>
	
</template>

<script>
	export default {
		data() {
			return{
				testTime_input: '',
				interval_input: '',
				index_with_time: 0,//valueArr中包含间隔和测试时间的索引
				deviceName:'',
				lightOptions:[0,0,0,0],//高亮选项，选中哪个就显示哪个图表，0是参数，1温度，2浊度，3BOD,默认显示参数
				chartDisplay:[true,false,false,false],//可以扩展，在后面追加false即可.目前新设备只能接4个传感器
				deviceArr:[],
				valueArr:[],
				currentLen:0,//当前带花括号的数据长度
				paramArr:["","DDM_μ","DDM_m","PHG","ORP","RDO","ION","ZS","DDM_S","COD","CL","CHLO","BGA","TPS","TSS","OIL","BOD"],
				unitArr:["","μS/cm","mS/cm","","mV","mg/L","mg/L","NTV","PSU","mg/L","mg/L","μg/L","Kcells/mL","mm","mg/L","mg/L",""],
				chartDataArr:[],
				eq:0, //剩余电量
				batteryColor:"",
				timer:null,
				opts: {
					enableScroll: true,
					update:true,
					legend: {show:false},
					animation:false,
					duration:0,	
					scrollPosition:'right',
					xAxis: {
					  itemCount: 8
					}
				}
			}
		},
		onLoad() {

		},

		onShow() {
			this.deviceName = getApp().globalData.deviceName //app.vue中应为""
			this.deviceArr = getApp().globalData.deviceArr //app.vue中应为[]
			this.valueArr = getApp().globalData.valueArr //app.vue中应为[]
			this.currentLen = this.valueArr.length //记住当前数值长度，当长度变化时，执行更新图表的逻辑
			
			if(this.valueArr.length>0){ //有花括号数据时，获取电量
				this.setElectric() 
			}
			setInterval(()=>{ //每5分钟获取一次电量
				if(this.valueArr.length>0){
					this.setElectric() 
				}
			},3000000)

			
			this.setChart()
			//循环执行，发现新数据就更新对应的表格
			this.timer = setInterval(()=>{
				
				if(this.currentLen==0){ //数据从无到有时，需要更新电量
					this.setElectric()
				}
				let newAddNum = this.valueArr.length-this.currentLen
				this.currentLen = this.valueArr.length

				if(this.deviceArr[0] && this.deviceArr[0].type!=1){  //不是多参数设备时，有新数据要更新图表的数据，多功能传感器暂时不设置图表功能
					if(newAddNum>0){ //说明有新的值
						let newValues = this.valueArr.slice(this.valueArr.length-newAddNum,this.valueArr.length)
						for(var oneRecord of newValues){
							let index = this.deviceArr.findIndex((item)=>{return item.param==oneRecord.param})
							let insertValue
							if(this.lightOptions[index]==0){
								insertValue = oneRecord.value
							}else if(this.lightOptions[index]==1){
								insertValue = oneRecord.temperature
							}else if(this.lightOptions[index]==2){
								insertValue = oneRecord.mud
							}else if(this.lightOptions[index]==3){
								insertValue = oneRecord.bod
							}
							
							this.chartDataArr[index] = {
								categories:[...this.chartDataArr[index].categories,this.chartDataArr[index].categories.length+1],
								series: [
								  {
									data: [...this.chartDataArr[index].series[0].data,...[insertValue]],
									textColor:'#aaa'
								  }
								]
							}
						}
					}
				}
				
			},3000)
			


		},
		
		onHide() {
			clearInterval(this.timer) //清除更新图表的定时器
		},
		methods:{
			open_alter_time_popup() {
				this.$refs.popup.open()
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close_popup() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...
				this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm_alter_time() {
				// 输入框的值
				let interval = parseInt(this.interval_input)
				let testTime = parseInt(this.testTime_input)
				if (interval && testTime) {
					if (interval < 256 && interval >= 1 && testTime < 256 && testTime >= 1) { // 执行修改时间的指令
						//将时间转为FC xx xx的十六进制格式
						let intervals_hex = interval.toString(16)
						if(intervals_hex.length<2){
							intervals_hex = '0'+intervals_hex
						}
						let testTime_hex = testTime.toString(16)
						if(testTime_hex.length<2){
							testTime_hex = '0'+testTime_hex
						}
						let msg = 'FC'+intervals_hex+testTime_hex
						
						var typedArray = new Uint8Array(msg.match(/[\da-f]{2}/gi).map(function (h) {
							return parseInt(h, 16)}))
						var buffer = typedArray.buffer
						// console.log(msg)
						uni.showLoading({
							title:'加载中'
						})
						let count = 0
						let alter_success = false //时间更改成功的标志
						setTimeout(()=>{
							uni.hideLoading() //超时关闭加载
							if(!alter_success){
								uni.showToast({
									title:"更改失败，请重新发送",
									icon:"none"
								})
							}
						},10000)
						getApp().writeValueToBle(msg,str=>{
							if(count<this.deviceArr.length*2){
								if(str.search("OK")!=-1){  //返回的数据带有[OK],表明时间修改成功
									uni.hideLoading()  //主动关闭加载
									uni.showToast({
										title:"修改成功",
										icon:"none"
									})
									getApp().globalData.isFirstData = true //时间修改成功后的第一条数据是带时间的
									this.index_with_time = this.valueArr.length
									alter_success = true
								}
								count++
							}
							//正常读取数据
							getApp().handleStrFromBlueTooth(str)
							
						})

						// 执行 close 才会关闭对话框
						this.$refs.popup.close()
					} else {
						uni.showToast({
							title: "请输入1~255之间的整数",
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: "请输入1~255之间的整数",
						icon: 'none'
					})
				}

			},
			test(){ 
				setTimeout(()=>{
						getApp().globalData.deviceArr.push({address:3,type:0,param:9})
				},1500)
				
				setTimeout(()=>{
						getApp().globalData.deviceArr.push({address:6,type:0,param:6})
						getApp().globalData.deviceArr.push({address:16,type:0,param:4})
						console.log('头数据接收完成')
				
				},2000)
				
				setTimeout(()=>{
				
						getApp().globalData.valueArr.push({param:4,address:16,value:Math.round(Math.random()*100),electric:3.764,testTime:3,interval:2})
					
				},2500)
				
				setInterval(()=>{
					
					getApp().globalData.valueArr.push(
						{param:9,address:3,value:Math.round(Math.random()*100),temperature:23.4,mud:3.4,bod:3.3,electric:3.764},
						{param:6,address:6,value:Math.round(Math.random()*100),temperature:23.4,electric:3.764},
						{param:4,address:16,value:Math.round(Math.random()*100),electric:3.764}
						// {temperature:20+Math.round(10*Math.random()),val1:5,val2:5,val3:Math.round(100*Math.random()),val4:Math.round(100*Math.random()),val5:Math.round(100*Math.random()),val6:3,val7:2,val8:32,electric:3.764}
					)
					
				},3000)
			},
			setChart(){
				this.deviceArr.forEach((item,index)=>{  //遍历设备数组
					let itemArr = this.valueArr.filter((item)=>{return item.param==this.deviceArr[index].param}) //获取某一传感器的值数据，作为图表的数据来源
					let categories = []
					let series_data = []
					let i=1
					for(var it of itemArr){
						categories.push(i)
						series_data.push(it.value)
						i++
					}
					// itemArr.map(item=>{return item.value})
					this.chartDataArr[index]={
						categories: categories,
						series: [
						  {
							data: series_data,
							textColor:'#aaa'
						  }
						]
					}
				})
			},
			
			setElectric(){
				if(this.valueArr.length>0){
					let electric = this.valueArr[this.valueArr.length-1].electric
					if(electric>=4.2){
						this.eq = 100
						this.batteryColor = 'greenyellow'
					}else if(electric>=4.1 && electric<4.2){
						this.eq = 90
						this.batteryColor = 'greenyellow'
					}else if(electric>=4.0 && electric<4.1){
						this.eq = 75
						this.batteryColor = 'yellow'
					}else if(electric>=3.9 && electric<4.0){
						this.eq = 60
						this.batteryColor = 'yellow'
					}else if(electric>=3.8 && electric<3.9){
						this.eq = 50
						this.batteryColor = 'orange'
					}else if(electric>=3.7 && electric<3.8){
						this.eq = 30
						this.batteryColor = 'orange'
					}else if(electric>=3.4 && electric<3.7){
						this.eq = 10
						this.batteryColor = 'orangered'
					}else{
						this.eq = 2
						this.batteryColor = 'orangered'
					}
				}
			},
			showOrFold(index){
				// this.showItem=index
				let flag = !this.chartDisplay[index]
				this.$set(this.chartDisplay,index,flag)
				
			},
			switchChart(index,type){
				this.$set(this.lightOptions,index,type)
				// this.lightOptions[index] = type
				let itemArr = this.valueArr.filter((item)=>{return item.param==this.deviceArr[index].param})  //取到索引对应传感器的值的数组
				let tempArr = []
				if(type == 1){tempArr = itemArr.map(item=>{return item.temperature})}
				else if(type == 2){tempArr = itemArr.map(item=>{return item.mud})}
				else if(type == 3){tempArr = itemArr.map(item=>{return item.bod})}
				else{tempArr = itemArr.map(item=>{return item.value}) } //type为0的情况，即化学参数
				
				let categories = []
				let i=1
				for(var it of tempArr){
					categories.push(i)
					i++
				}
				
				this.chartDataArr[index] = {
					//categories和默认参数是一样的，不用设置
					categories:categories,
					series: [
					  {
						data: tempArr,
						textColor:'#aaa'
					  }
					]
				}
			},
			//跳转到时间校准页面
			toAlterTime(){
				// uni.navigateTo({
				// 	url:'/pages/setting/timeCalibration'
				// })
				this.open_alter_time_popup()
			}
			
		},
		
		watch:{
			deviceArr(){ //监听到deviceArr发生变化后，要重构图表列表
				this.setChart()
			}
		}
	}
</script>

<style lang="scss">
	.element_style{
		background-color: white;
		padding: 15rpx;
		border: 3rpx solid lightgray;
		border-radius: 30rpx;
	}
	.chart_view{
		padding: 10rpx;
		border-radius: 15rpx;
		margin: 15rpx;
		border: 3rpx solid lightgray;
		background-color: white;
	}
	.time_style{
		height: 100rpx;width: 50%;text-align: center;line-height: 100rpx;
	}
	.chart_style{
		height: 300rpx;
		width: 100%;
	}
	.row{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		.item{
			border-right: 1rpx solid gray;width: 25%;text-align: center;line-height: 60rpx;padding:0rpx 30rpx;font-size: 25rpx;
		}
	}
	.head{
		margin: 15rpx 40rpx;background-image: linear-gradient(to bottom right,skyblue,white);display: inline-block;height: 150rpx;width: 150rpx;border-radius: 75rpx;
		text-align: center;line-height: 150rpx;font-weight: 800;font-size: 35rpx;color: dimgray
		
	}
	.outer{
		padding: 20rpx;
		background-image: url('../../static/background.jpg'); //小程序下背景无效
		background-size: 100% auto;
		background-repeat: no-repeat;
	}
	
	.flex_row_between{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.battery{
		border: 5rpx solid white ;width: 150rpx;height: 50rpx;
		text-align: center;color: white;line-height: 50rpx;font-size: 33rpx;
		font-weight: 600;border-radius: 15rpx;
	}
	page{
		background-color: #EFEFEF;  //页面类似组件，高度是动态的，设置成和背景图片下面一样的颜色
	}
	.bg-img{
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    top: 0;
	    left: 0;
	    z-index: -1;
	}
	.input_style {
		border: 1rpx solid #eee;
		border-radius: 10rpx;
		padding: 15rpx;
		width: 85%;
	}
	
	.alter_time_view {
		background-color: white;
		width: 500rpx;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.btn_group {
		width: 100%;
		display: flex;
		padding: 20rpx 0;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		border-top: 1rpx solid #eee;
	}
	.remind_connect{
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