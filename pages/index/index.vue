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
		
		<view style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 0rpx 20rpx;">
			<view class="head">{{deviceArr.length>1?'多设备':(deviceArr.length==1?(deviceArr[0].type==1?'多参数':paramArr[deviceArr[0].param]):'未连接')}}</view>
			<view>
				<text style="text-align: center;font-size: 40rpx;color: #ffffff;font-weight: bold;text-shadow: 2px 2px 1px #a8a8a8;">{{deviceName}}</text>

			</view>
			<!-- 电池 -->
			<view class="flex_row_between" style="justify-content: center;align-items: center;">
				<view class="battery" style="display: inline-block;">
					<view style="z-index: 1;position: relative;">{{eq}}</view>
					<view :style="{'width': eq+'%','background-color': batteryColor}" style="z-index: 0;position: relative;bottom:30rpx;height: 100%;border-radius: 7rpx;"></view>
				</view>
				<view style="background-color: white;width: 7rpx;height: 18rpx;border-top-right-radius: 7rpx;border-bottom-right-radius: 7rpx;"></view>
			</view>
		</view>
		
		<view class="element_style flex_row_between" style="margin: 20rpx 15rpx;">
			<view class="time_style" style="border-right: 1rpx solid lightgray;" @click="toAlterTime()">间隔时间{{valueArr[index_with_time]?(valueArr[index_with_time].interval?': '+valueArr[index_with_time].interval+'min':''):''}}</view>
			<view class="time_style" @click="toAlterTime()">测试时间{{valueArr[index_with_time]?(valueArr[index_with_time].testTime?': '+valueArr[index_with_time].testTime+'min':''):''}}</view>
		</view>
		
		<view v-if="deviceArr[0]">
			<view v-if="deviceArr[0].type!=1">
				<view v-for="device,index in deviceArr" class="chart_view" :key="index">
					<view class="flex_row_between" style="padding: 0rpx 40rpx;height: 100rpx;align-items: center;">
						<view class="flex_row_between" style="width: 80%;font-size: 35rpx;">
							<view  @click="switchChart(index,0)" :style="lightOptions[index]==0?'color: #2D9AFF;font-weight: bold':''">{{paramArr[device.param]}}</view>
							<view>{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().value:""}}{{unitArr[device.param]}}</view>
						</view>
						<image v-if="deviceArr.length!=0" :src="chartDisplay[index]?'../../static/折叠.png':'../../static/展开.png'" @click="showOrFold(index)" style="width: 50rpx;height: 50rpx"></image>
					</view>
					
					<view v-if="chartDisplay[index]">
						<view class="flex_row_between" style="padding: 20rpx 30rpx;border-top: 1px solid lightgray;">
							<view class="flex_row_between" style="width: 80%;">
								<view style="color: gray;">地址：{{device.address}}</view>
								<view v-if="device.param!=4"  @click="switchChart(index,1)"><text :style="lightOptions[index]==1?'color: #2D9AFF;font-weight: bold':''">温度</text>：{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().temperature:""}} ℃</view>
							</view>
						</view>
						
						<view v-if="device.param==9" class="flex_row_between" style="padding: 0rpx 30rpx;margin-bottom: 20rpx;">
							<view class="flex_row_between" style="width: 80%;">
								<view @click="switchChart(index,2)" ><text :style="lightOptions[index]==2?'color: #2D9AFF;font-weight: bold':''">浊度</text>：{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().mud:""}} NTU</view>
								<view @click="switchChart(index,3)" ><text :style="lightOptions[index]==3?'color: #2D9AFF;font-weight: bold':''">BOD</text>：{{valueArr.filter((item)=>{return item.param==device.param}).pop()?valueArr.filter((item)=>{return item.param==device.param}).pop().bod:""}} mg/L</view>
							</view>
						</view>
						
						<qiun-data-charts type="line" :chartData="chartDataArr[index]" :opts="opts" :ontouch="true"/>
					</view>
				
				</view>
				
			</view>
			
			<!-- 多参数类型 -->
			<view v-else>
				<view class="element_style" style="margin: 15rpx;padding: 20rpx 10rpx;">
					<view style="display: flex;flex-wrap: wrap;">
						<view @click="switchManyParamChart(-1)" :style="manyParamLightOption==-1?'color: #007AFF;':''" class="item" style="border-right: 1rpx solid gray;">温度<text>\n</text>{{valueArr.length?valueArr[valueArr.length-1].temperature:''}}</view>
						<view @click="switchManyParamChart(index)"  v-for="paramItem,index in originalManyParamsConfig" class="item" 
						:style="((index-1)%3==0?'':'border-right: 1rpx solid gray;')+(manyParamLightOption==index?'color: #007AFF;':'')" >
							{{index<2?(manyParamsConfig?(manyParamsConfig[0]=='COD'?paramItem:'--'):paramItem):(manyParamsConfig?(manyParamsConfig[index-1]=='未连接'?'--':manyParamsConfig[index-1]):paramItem)}}<text>\n</text>{{valueArr.length?valueArr[valueArr.length-1].values[index]:''}}
						</view>
						
					</view>
					<qiun-data-charts type="line" :chartData="chartDataArr[0]" :opts="opts_many" :ontouch="true"/>
					
				</view>
			</view>
				
		</view>

		
		<view v-if="showLoading" class="remind_connect">
			<loading txt="正在获取数据"></loading>
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
				manyParamLightOption:-1, //多参数高亮选项，默认-1代表显示温度
				lightOptions:[0,0,0,0],//高亮选项，选中哪个就显示哪个图表，0是参数，1温度，2浊度，3BOD,默认显示参数
				chartDisplay:[true,false,false,false],//可以扩展，在后面追加false即可.目前新设备只能接4个传感器
				deviceArr:[],
				valueArr:[],
				// currentLen:0,//当前带花括号的数据长度
				paramArr:["","DDM_μ","DDM_m","PHG","ORP","RDO","ION","ZS","DDM_S","COD","CL","CHLO","BGA","TPS","TSS","OIL","BOD"],
				unitArr:["","μS/cm","mS/cm","","mV","mg/L","mg/L","NTU","PSU","mg/L","mg/L","μg/L","Kcells/mL","mm","mg/L","mg/L",""],
				chartDataArr:[],
				eq:0, //剩余电量
				batteryColor:"",
				electric_timer:null, //定时器，每隔一段时间刷新电量
				opts: {
					enableScroll: true,
					update:true,
					legend: {show:false},
					animation:false,
					duration:0,	
					scrollPosition:'right',
					xAxis: {
					  itemCount: 8
					},
					yAxis: {
						// showTitle:true,
						data: [{
							// title: "单位：mg/L", //纵坐标单位
							tofix: 0, //保留几位小数，0表示随数据自动调整
							// min:0,
							// max:100
						}]
					}
				},
				opts_many:{
					enableScroll: true,
					update:true,
					legend: {show:false},
					animation:false,
					duration:0,	
					scrollPosition:'right',
					xAxis: {
					  itemCount: 8
					},
					yAxis: {
						showTitle:true,
						data: [{
							title: "℃", //纵坐标单位
							tofix: 0, //保留几位小数，0表示随数据自动调整
						}]
					}
				},
				manyParamsConfig:null,
				showLoading:false,
				manyParamChartData:null,
				originalManyParamsConfig:["化学需氧量(COD)","浊度(COD)",'电导率/盐度','PH','ORP','溶解氧','铵氮/离子类','浊度'],
				originalManyParamsConfigUnit:["mg/L","NTU","mS/cm","","mV","mg/L","mg/L","NTU"]
			}
		},
		onload(){
			
		},

		onShow() {
			// console.log('执行了onShow')
			this.manyParamsConfig = uni.getStorageSync("manyParamsConfig") //获取多参数参数表配置
			
			if(getApp().globalData.firstLoading && getApp().globalData.deviceCoreData.writeCharacteristicId){ //同时满足初次加载，且有写数据id两个条件时执行
				this.index_with_time = 0
				this.showLoading = true
				console.log("首页发送f900")
				getApp().writeValueToBle('F900',getApp().handleStrFromBlueTooth)
				getApp().globalData.firstLoading = false //再次点进来时，就不再重发f900
				setTimeout(()=>{
					this.showLoading = false
					if(this.deviceArr.length==0){
						uni.showToast({
							icon:"none",
							title:"数据获取失败"
						})
						getApp().globalData.firstLoading = true //下次进入时，会重发f900
					}
				},30000) //30秒加载不到数据就自动关闭动画
			}
			
			this.deviceName = getApp().globalData.deviceName //app.vue中应为""
			this.deviceArr = getApp().globalData.deviceArr //app.vue中应为[]
			this.valueArr = getApp().globalData.valueArr //app.vue中应为[]
			// this.currentLen = this.valueArr.length //记住当前数值长度，当长度变化时，执行更新图表的逻辑
			
			if(this.valueArr.length>0){ //有花括号数据时，获取电量
				this.setElectric() 
			}
			this.electric_timer = setInterval(()=>{ //每5分钟获取一次电量
				if(this.valueArr.length>0){
					this.setElectric() 
				}
			},3000000)

			this.setChart()

		},
		
		onReady() {  //onShow方法中showLoading无效,但是onReady只执行一次
			// setInterval(()=>{
			// 	this.valueArr.push({temperature:23.5,values:[25,15,24.3,3.3,3.1,2,3,32],electric:3.764})
			// },3000)

		},
		onHide() {
			clearInterval(this.electric_timer) //清除更新电量的定时器
		},
		methods:{
			switchManyParamChart(index){
				this.manyParamLightOption = index
				let categories = []
				let data = []
				let i=1
				if(index==-1){
					this.opts_many.yAxis.data[0].title = "℃"
					for(var value of this.valueArr){
						categories.push(i)
						data.push(value.temperature)
						i++
					}
				}else{
					if(this.manyParamsConfig){ //参数表手动修改过
						if(index>1){
							
							this.opts_many.yAxis.data[0].title = getApp().globalData.manyParamCustomUnits[getApp().globalData.manyParamCustomOptions.indexOf(this.manyParamsConfig[index-1])]
						}else{
							if(index==0){
								this.opts_many.yAxis.data[0].title = "mg/L"
							}else if(index == 1){
								this.opts_many.yAxis.data[0].title = "NTU"
							}
						}
					}else{ //多参数默认配置的情况
						this.opts_many.yAxis.data[0].title = this.originalManyParamsConfigUnit[index]
					}
				
					for(var value of this.valueArr){
						categories.push(i)
						data.push(value.values[index])
						i++
					}
				}
				

				this.chartDataArr[0] = {
					//categories和默认参数是一样的，不用设置
					categories:categories,
					series: [
					  {
						data: data,
						textColor:'#aaa',
						// name:name
					  }
					]
				}
			},
			open_alter_time_popup() {
				this.$refs.popup.open()
			},
			/**
			 * 点击取消按钮触发
			 */
			close_popup() {
				this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发
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
							title:'更改中'
						})
						
						setTimeout(()=>{
							uni.hideLoading() //超时关闭加载
							if(!alter_success){
								uni.showToast({
									title:"更改失败，请重新发送",
									icon:"none"
								})
							}
						},10000)
						let count = 0
						let alter_success = false //时间更改成功的标志
						getApp().writeValueToBle(msg,str=>{
							if(count<this.deviceArr.length*2){
								if(str.search("[OK]")!=-1){  //返回的数据带有[OK],表明时间修改成功
									console.log("判断返回的数据是否带有[OK]")
									uni.hideLoading()  //主动关闭加载
									uni.showToast({
										title:"修改成功",
										icon:"none"
									})
									getApp().globalData.isFirstData = true //时间修改成功后的第一条数据是带时间的
									this.index_with_time = this.valueArr.length
									alter_success = true
									
									if(!getApp().globalData.isNewDevice){ //老设备在f900状态修改了时间，返回【OK】后会停止发数据,要重新发f900
										getApp().writeValueToBle('F900',getApp().handleStrFromBlueTooth)
									}
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
					let itemArr
					let categories = []
					let series_data = []
					let param_name
					let i=1
					if(item.type == 1){ //多参数情况
						itemArr = this.valueArr //获取全部值数据，作为图表的数据来源
						for(var it of itemArr){
							categories.push(i)
							series_data.push(it.temperature)//多参数默认显示温度
							i++
						}
						param_name = ''
					}else{ //一般情况
						itemArr = this.valueArr.filter((item)=>{return item.param==this.deviceArr[index].param}) //获取某一传感器的值数据，作为图表的数据来源
						for(var it of itemArr){
							categories.push(i)
							series_data.push(it.value)//单参数默认显示主参数值
							i++
						}
						param_name = this.paramArr[this.deviceArr[index].param]
					}

					// itemArr.map(item=>{return item.value})
					this.chartDataArr[index]={
						categories: categories,
						series: [
						  {
							data: series_data,
							textColor:'#aaa',
							name:param_name
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
				let name = "" //点击某一项时，显示的参数名称
				if(type == 1){
					tempArr = itemArr.map(item=>{return item.temperature})
					name = "温度"
				}
				else if(type == 2){
					tempArr = itemArr.map(item=>{return item.mud})
					name = "浊度"
				}
				else if(type == 3){
					tempArr = itemArr.map(item=>{return item.bod})
					name = "BOD"
				}
				else{
					tempArr = itemArr.map(item=>{return item.value}) 
					name = this.paramArr[this.deviceArr[index].param]
				} //type为0的情况，即化学参数
				
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
						textColor:'#aaa',
						name:name
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
				if(this.deviceArr.length){
					this.showLoading = false //事实上只需要执行一次就够了，反正deviceArr也就几条
				}
				this.setChart()
			},
			valueArr(){ //valueArr加入新数据后，要对相应折线图的数据重新赋值
				if(this.deviceArr[0] && this.deviceArr[0].type == 1){ //接多参数的情况,多参数的情况下设备列表只能有一支
					//给多参数折线图chartdata赋值的逻辑写在这里
					if(this.valueArr.length==1){ //从无到有的第一条，要设置一次电量
						this.setElectric()
					}
					let newValue = this.valueArr[this.valueArr.length-1]
					let insertValue
					if(this.manyParamLightOption==-1){ //当前显示的是温度
						insertValue = newValue.temperature
					}else{
						insertValue = newValue.values[this.manyParamLightOption]
					}
					this.chartDataArr[0] = {
						categories:[...this.chartDataArr[0].categories,this.chartDataArr[0].categories.length+1],
						series: [
						  {
							data: [...this.chartDataArr[0].series[0].data,...[insertValue]],
							textColor:'#aaa'
						  }
						]
					}
					return
				}
				if(this.valueArr.length){
					if(this.valueArr.length==1){ //从无到有的第一条，要设置一次电量
						this.setElectric()
					}
					let newValue = this.valueArr[this.valueArr.length-1]
					let index = this.deviceArr.findIndex((item)=>{return item.param==newValue.param}) //根据param获取新数据在列表中的索引
					let insertValue  
					if(this.lightOptions[index]==0){ //lightOptions[index]是新加入的数据所对应的图表中所选的参数，0主要参数、1温度、2浊度、3BOD
						insertValue = newValue.value
					}else if(this.lightOptions[index]==1){
						insertValue = newValue.temperature
					}else if(this.lightOptions[index]==2){
						insertValue = newValue.mud
					}else if(this.lightOptions[index]==3){
						insertValue = newValue.bod
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
	}
</script>

<style lang="scss">
	.element_style{
		background-color: white;
		padding: 15rpx;
		border: 3rpx solid lightgray;
		border-radius: 25rpx;
	}
	.chart_view{
		padding: 10rpx;
		border-radius: 15rpx;
		margin: 15rpx;
		border: 3rpx solid lightgray;
		background-color: white;

	}
	.time_style{
		height: 70rpx;width: 50%;text-align: center;line-height: 70rpx;
	}

	.item{
		text-align: center;line-height: 40rpx;font-size: 25rpx;width: 33%;margin-bottom: 30rpx;
	}
	
	.head{
		margin: 15rpx 0rpx;background-image: linear-gradient(to bottom right,skyblue,white);display: inline-block;height: 150rpx;width: 150rpx;border-radius: 75rpx;
		text-align: center;line-height: 150rpx;font-weight: 800;font-size: 35rpx;color: dimgray
		
	}
	.outer{
		padding: 30rpx;
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
		border: 5rpx solid white ;width: 90rpx;height: 30rpx;
		text-align: center;color: white;line-height: 30rpx;font-size: 25rpx;
		border-radius: 10rpx;
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