<template>
	<view class="outer">
		<!-- 只在小程序下生效 -->
		<!-- #ifdef MP -->
		     <image class="bg-img" src="/static/background.jpg"></image>
		<!-- #endif -->
		<!-- 修改时间的弹窗 -->
		<uni-popup ref="popup" type="dialog">
			<view class="alter_time_view">
				<view style="margin-top: 20rpx;color: gray;">{{$t('时间修改')}}</view>
				<input type="text" v-model:value="interval_input" :placeholder="$t('请输入间隔时间')" class="input_style"
					style="margin-top: 20rpx;" />
				<input type="text" v-model:value="testTime_input" :placeholder="$t('请输入测试时间')" class="input_style"
					style="margin: 20rpx;" />
				<!-- <view style="width: 90%;margin-bottom: 20rpx;color: lightgray;">说明:间隔时间是设备存储周期，测试时间是第一次存储前等待数据稳定所用的时间，测试时间必须小于间隔时间，单位均为min。存储的数据可在设置-历史数据中查看</view> -->
				<view class="btn_group">
					<view style="border-right: 1rpx solid #eee;width: 50%;text-align: center;" @click="close_popup()">{{$t('取消')}}
					</view>
					<view style="width: 50%;text-align: center;color: #007AFF" @click="confirm_alter_time()">{{$t('确定')}}</view>
				</view>
				
			</view>
		</uni-popup>
		
		<view style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 0rpx 20rpx;">
			<view class="head">{{deviceArr.length>1?$t('多设备'):(deviceArr.length==1?(deviceArr[0].type==1?$t('多参数'):$t(paramArr[deviceArr[0].param])):$t('未连接'))}}</view>
			
			<view style="display: flex;">
				<text style="text-align: center;font-size: 40rpx;color: #ffffff;font-weight: bold;text-shadow: 2px 2px 1px #a8a8a8;">{{deviceName}}</text>
				<u-loading-icon v-if="homeConfig.waitFirstValue" mode="circle" style="margin-left: 10rpx;"></u-loading-icon>
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
		
		<view class="element_style flex_row_between shadow" style="margin: 20rpx 15rpx;background-color: rgba(255, 255, 255, 0.8);"> 
			<view class="time_style" style="border-right: 1rpx solid lightgray;" @click="toAlterTime()">{{$t('间隔时间')}}{{valueArr[index_with_time]?(valueArr[index_with_time].interval?': '+valueArr[index_with_time].interval+'min':''):''}}</view>
			<view class="time_style" @click="toAlterTime()">{{$t('测试时间')}}{{valueArr[index_with_time]?(valueArr[index_with_time].testTime?': '+valueArr[index_with_time].testTime+'min':''):''}}</view>
		</view>
		
		<view v-if="deviceArr[0]">
			<view v-if="deviceArr[0].type!=1">
				<view v-for="device,index in deviceArr" class="chart_view shadow" :key="index">
					<view class="flex_row_between" style="padding: 0rpx 40rpx;height: 100rpx;align-items: center;">
						<view class="flex_row_between" style="width: 80%;font-size: 35rpx;" :style="lightOptions[index]==0?'color: #2D9AFF;font-weight: bold':''">
							<view  @click="switchChart(index,0)" >{{$t(paramArr[device.param])}}</view>
							<view @click="switchChart(index,0)">
							<!-- #ifdef APP-PLUS -->
							{{valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop()?valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop().value:''}}
							<!-- #endif -->
							<!-- #ifndef APP-PLUS -->
							{{valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})!=-1?
							valueArr[valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})].value:''}}
							<!-- #endif -->
							
							<text class="unit">{{unitArr[device.param]}}</text>
							</view>
						</view>
						<image v-if="deviceArr.length!=0" :src="chartDisplay[index]?'../../static/fold.png':'../../static/show.png'" @click="showOrFold(index)" style="width: 50rpx;height: 50rpx"></image>
					</view>
					
					<view v-if="chartDisplay[index]">
						<view class="flex_row_between" style="padding: 20rpx 30rpx;border-top: 1px solid lightgray;">
							<view class="flex_row_between son_param_row">
								<view style="color: gray;"><text >{{$t('地址')}}：</text>{{device.address}}</view>
								<view v-if="device.param!=4"  @click="switchChart(index,1)" class="right_son_param" :style="lightOptions[index]==1?'color: #2D9AFF;font-weight: bold':''"><text >{{$t('温度')}}：</text>

								<!-- #ifdef APP-PLUS -->
								{{valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop()?valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop().temperature:''}}
								<!-- #endif -->
								<!-- #ifndef APP-PLUS -->
								{{valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})!=-1?
								valueArr[valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})].temperature:''}} 
								<!-- #endif -->
								<text class="unit">℃</text></view>
							</view>
						</view>
						
						<view v-if="device.param==9" class="flex_row_between" style="padding: 0rpx 30rpx;margin-bottom: 20rpx;">
							<view class="flex_row_between son_param_row">
								<view @click="switchChart(index,2)" :style="lightOptions[index]==2?'color: #2D9AFF;font-weight: bold':''"><text >{{$t('浊度')}}：</text>
								 <!-- #ifdef APP-PLUS -->
								 {{valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop()?valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop().mud:''}}
								 <!-- #endif -->
								 <!-- #ifndef APP-PLUS -->
								{{valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})!=-1?
								valueArr[valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})].mud:''}}
								 <!-- #endif -->

								 <text class="unit">NTU</text></view>
								<view @click="switchChart(index,3)" class="right_son_param" :style="lightOptions[index]==3?'color: #2D9AFF;font-weight: bold':''"><text >BOD：</text>

								 
								 <!-- #ifdef APP-PLUS -->
								  {{valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop()?valueArr.slice(-10).filter((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)}).pop().bod:''}}
								  <!-- #endif -->
								  <!-- #ifndef APP-PLUS -->
								{{valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})!=-1?
								valueArr[valueArr.findLastIndex((item)=>{return (item.param==device.param)&&(item.address?(item.address==device.address):true)})].bod:''}}
								  <!-- #endif -->
								 <text class="unit">mg/L</text></view>
							</view>
						</view>
						<!-- #ifdef MP -->
						<qiun-data-charts style="margin: 20rpx 0;" type="area" :chartData="chartDataArr[index]" :opts="optsArr[index]" :ontouch="true" canvas2d :canvasId="'chart'+index"/>
						<!-- #endif -->
						
						<!-- #ifndef MP -->
						<qiun-data-charts style="margin: 20rpx 0;" type="area" :chartData="chartDataArr[index]" :opts="optsArr[index]" :ontouch="true"/>
						<!-- #endif -->
					</view>
				
				</view>
			</view>
			
			<!-- 多参数类型 -->
			<view v-else>
				<view class="element_style shadow" style="margin: 15rpx;padding: 20rpx 10rpx;">
					<view style="display: flex;flex-wrap: wrap;">
						<view @click="switchManyParamChart(-1)" :style="manyParamLightOption==-1?'color: #007AFF;':''" class="item" style="border-right: 1rpx solid gray;">{{$t('温度')}}<text>\n</text>{{valueArr.length?valueArr[valueArr.length-1].temperature:''}}</view>
						<view @click="switchManyParamChart(index)"  v-for="paramItem,index in originalManyParamsConfig" class="item" 
						:style="((index-1)%3==0?'':'border-right: 1rpx solid gray;')+(manyParamLightOption==index?'color: #007AFF;':'')" >
							{{index<2?(manyParamsConfig?(manyParamsConfig[0]=='COD'?$t(paramItem):'--'):$t(paramItem)):(manyParamsConfig?(manyParamsConfig[index-1]=='未连接'?'--':$t(manyParamsConfig[index-1])):$t(paramItem))}}
							<text>\n</text>{{valueArr.length?valueArr[valueArr.length-1].values[index]:''}}
						</view>
					</view>
					<!-- #ifdef MP --> 
					<qiun-data-charts style="margin-bottom: 10rpx;" type="area" :chartData="chartDataArr[0]" :opts="optsArr[0]" :ontouch="true" canvas2d canvasId="chart0"/>
					<!-- #endif -->
					<!-- #ifndef MP -->
					<qiun-data-charts style="margin-bottom: 10rpx;" type="area" :chartData="chartDataArr[0]" :opts="optsArr[0]" :ontouch="true"/>
					<!-- #endif -->
				</view>
			</view>
				
		</view>
		
		<view v-if="showLoading && deviceArr.length==0" class="remind_connect">
			<loading :txt="$t('正在获取数据')"></loading>
		</view>

		<view v-if="!showLoading && deviceArr.length==0" class="remind_connect">
			<image src="../../static/no_data.png" style="width: 400rpx;height: 400rpx;margin-top: 100rpx;"></image>
			<text style="color: #ccc;">{{$t('暂无数据')}}</text>
		</view>
		
		<waiting ref="loading_device" :title="popup_title" :content="popup_content" showHide></waiting>
		<!-- <navigator url="../test/test">测试页</navigator> -->
	</view>
	
</template>

<script>
import test from '../../uni_modules/uview-ui/libs/function/test';
	export default {
		data() {
			return{
				popup_title:'',
				popup_content:'',
				testTime_input: '',
				interval_input: '',
				index_with_time: 0,//valueArr中包含间隔和测试时间的索引
				deviceName:'',
				manyParamLightOption:-1, //多参数高亮选项，默认-1代表显示温度
				lightOptions:[0,0,0,0],//高亮选项，选中哪个就显示哪个图表，0是参数，1温度，2浊度，3BOD,默认显示参数
				chartDisplay:[true,false,false,false],//可以扩展，在后面追加false即可.目前新设备只能接4个传感器
				deviceArr:[],
				valueArr:[],
				// paramArr:["","DDM_μ","DDM_m","PH","ORP","RDO","ION","ZS","DDM_S","COD","CL","CHLO","BGA","TPS","TSS","OIL","BOD"],
				paramArr:getApp().globalData.paramArr,
				unitArr:getApp().globalData.unitArr,
				chartDataArr:[],
				staticChartData:{
					categories:[1,2,3,4,5,6,7,8],
					series: [
					  {
						data: [43,67,87,45,23,67,98,65],
						textColor:'#aaa',
						// name:name
					  }
					]
				},
				eq:0, //剩余电量
				batteryColor:"",
				electric_timer:null, //定时器，每隔一段时间刷新电量
				opts: {
					// enableScroll: true,
					update:true,
					legend: {show:false},
					animation:false,
					duration:0,	
					// scrollPosition:'right',
					xAxis: {
					  itemCount: 8,
					  boundaryGap: "justify",//消除左右间距
					  disableGrid: false,//绘制纵向线条
					},
					yAxis: {
						showTitle:true,
						data: [{
							title: "", //纵坐标单位
							// min:0,
							// max:100
							tofix: 0, //保留几位小数，0表示随数据自动调整
					
						}]
					}
				},
				optsArr:[],
				manyParamsConfig:null,
				showLoading:false,
				manyParamChartData:null,
				originalManyParamsConfig:getApp().globalData.originalManyParamsConfig,
				originalManyParamsConfigUnit:getApp().globalData.originalManyParamsConfigUnit,
				homeConfig:getApp().globalData.homeConfig, //判断是否收到花括号数据，在收到第一条后将waitFirstValue属性改为false，使用对象是为了和全局变量绑定
				limit:8,//小程序端限制折线图数据条数
				isReload:false, //判断是否正在重新加载数据，重新加载时,onshow方法中的f900不发送
				reloadNum:0,//连续重新加载的次数，过大则提示重启硬件
				command:"f900",
				wait_time:30000, //f900加载动画的持续时间
			}
		},
		onLoad(){
			
			//小程序端App Launch读不到globalData
			if(uni.getStorageSync("autoDownload")){
				getApp().globalData.autoDownload = uni.getStorageSync("autoDownload")
			}
			if(uni.getStorageSync("onlyOneSensor")){
				getApp().globalData.onlyOneSensor = uni.getStorageSync("onlyOneSensor")
			}
			/*#ifdef MP*/
				if(uni.getStorageSync("language")){
					this.$i18n.locale = uni.getStorageSync("language");
					uni.setLocale(uni.getStorageSync("language"))
				}
			/*#endif*/
		},

		onShow() {
			
			this.wait_time = getApp().globalData.isNewDevice?15000:30000 //新设备加载速度通常在15秒以内
			this.manyParamsConfig = uni.getStorageSync("manyParamsConfig") //获取多参数参数表配置
			// console.log(this.manyParamsConfig)
			if(getApp().globalData.firstLoading && getApp().globalData.deviceCoreData.writeCharacteristicId){ //同时满足初次加载，且有写数据id两个条件时执行
				
				if(getApp().globalData.onlyOneSensor && getApp().globalData.isNewDevice){ //如果设置了识别单只传感器，且是新版蓝精灵，就用f90001，加快扫描速度
					this.command = 'f90001'
				}else{
					this.command = 'f900'
				}
				// console.log("首页发送f900")
				getApp().writeValueToBle(this.command,getApp().handleStrFromBlueTooth,null,()=>{ //f900发送成功才执行以下语句
					this.index_with_time = 0
					this.showLoading = true //开启背景动画
					setTimeout(()=>{ //加入延时是防止页面没加载好就调用弹出层导致报错
						this.openWaitingPopup("加载设备","发起指令，正在等待结果")
					},200)
					
					getApp().globalData.firstLoading = false //再次点进来时，就不再重发f900
					setTimeout(()=>{
						this.showLoading = false
						if(this.deviceArr.length==0){ //长度为0，代表没获取到设备
							this.closeWaitingPopup("加载失败，未获取到数据") //传入true会显示是否重新加载的弹窗
							this.loadingOvertime()
							getApp().globalData.firstLoading = true //下次进入时，会重发f900
						}
					},this.wait_time) //30秒加载不到数据就自动关闭动画
				})

			}

			this.deviceName = getApp().globalData.deviceName //app.vue中应为""
			this.deviceArr = getApp().globalData.deviceArr //app.vue中应为[]
			this.valueArr = getApp().globalData.valueArr //app.vue中应为[]
			
			if(this.valueArr.length>0){ //有花括号数据时，获取电量
				this.setElectric() 
			}
			// this.electric_timer = setInterval(()=>{ //每5分钟获取一次电量
			// 	if(this.valueArr.length>0){
			// 		this.setElectric() 
			// 	}
			// },3000000)

		},
		

		onHide() {
			// clearInterval(this.electric_timer) //清除更新电量的定时器
			
		},
		onPullDownRefresh() { //下拉后，重新加载数据
			let that = this
			uni.showModal({
				content:that.$t("是否重新加载数据"),
				success(res) {
					uni.stopPullDownRefresh() //关闭下拉操作的顶部动画
					if(res.confirm){
						that.reloadData()
					}
				}
			})
			
		
		},
		methods:{
			loadingOvertime(){ //加载超时的操作
				setTimeout(()=>{
					uni.showToast({
						icon:'none',
						title:'加载超时，可尝试重新进入该页面'
					})
				},1500) //弹窗动画关闭后半秒再弹出toast提示


			},
			reloadData(){ //用于下拉重新加载
				this.reloadNum++
				let that = this
				
				getApp().writeValueToBle(this.command,str=>{
					getApp().handleStrFromBlueTooth(str)
				},null,()=>{ //指令发送成功的额外操作，前面那个null代表失败的额外操作，不传不行
					that.index_with_time = 0 //数据清空了，重置带时间的value索引
					that.showLoading = true //开启背景动画，用于显示加载状态
					that.openWaitingPopup("重新加载","正在重新加载设备")
					getApp().globalData.firstLoading = false //30秒内重新点进首页时，不再重发f900
					
					getApp().globalData.deviceArr = [] //清除数据
					getApp().globalData.valueArr = []
					getApp().globalData.addressToParamMap = []
					that.deviceArr = getApp().globalData.deviceArr //全局指向的引用更改了，this的也要跟着变
					that.valueArr = getApp().globalData.valueArr 
					
					setTimeout(()=>{
						that.showLoading = false
						if(that.deviceArr.length==0){
							that.closeWaitingPopup("加载失败，未获取到数据")
							this.loadingOvertime()
							getApp().globalData.firstLoading = true

						}
					},this.wait_time) //30秒加载不到数据就自动关闭动画
				})
			},
			openWaitingPopup(title,content){
				this.popup_title = title
				this.popup_content = content
				this.$refs.loading_device.open()
			},
			closeWaitingPopup(content){
				this.popup_content = content
				setTimeout(()=>{ //延迟1s秒关闭弹窗，好让用户看到失败信息
					this.$refs.loading_device.close()

				},1000)
			},
			switchManyParamChart(index){
				this.manyParamLightOption = index
				// let categories = []
				let data = []
				let i=1
				let valueArr = this.valueArr.slice(-this.limit)
				if(index==-1){
					this.optsArr[0].yAxis.data[0].title = "℃"
					for(var value of valueArr){
						// categories.push(i)
						data.push(value.temperature)
						i++
					}
				}else{

					for(var value of valueArr){
						// categories.push(i)
						data.push(value.values[index])
						i++
					}

					//ORP可能是负的，如果切换到的是ORP，就把下限设为最小值
					if((this.manyParamsConfig && getApp().globalData.manyParamCustomOptions[getApp().globalData.manyParamCustomOptions.indexOf(this.manyParamsConfig[index-1])]=="ORP")
					|| (!this.manyParamsConfig && index==4)){
						let min = Math.min.apply(null,data)
						if(min<0){
							let add = 5-Math.ceil(-min)%5
							min = Math.floor(min)-add
							this.optsArr[0].yAxis.data[0].min = min
						}
					}else{
						this.optsArr[0].yAxis.data[0].min = 0
					}
					
					if(this.manyParamsConfig){ //参数表手动修改过
						if(index>1){
							this.optsArr[0].yAxis.data[0].title = getApp().globalData.manyParamCustomUnits[getApp().globalData.manyParamCustomOptions.indexOf(this.manyParamsConfig[index-1])]
						}else{
							if(index==0){
								this.optsArr[0].yAxis.data[0].title = "mg/L"
							}else if(index == 1){
								this.optsArr[0].yAxis.data[0].title = "NTU"
							}
						}

					}else{ //多参数默认配置的情况
						this.optsArr[0].yAxis.data[0].title = this.originalManyParamsConfigUnit[index]
					}

				}
				
				this.chartDataArr[0] = {
					categories:this.chartDataArr[0].categories,
					series: [
					  {
						data: data,
						textColor:'#aaa',
						// name:name
					  }
					]
				}
				this.alterChartMax(0)
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

						uni.showLoading({
							title:this.$t('更改中')
						})
						
						let count = 0
						let alter_success = false //时间更改成功的标志
						
						setTimeout(()=>{
							uni.hideLoading() //超时关闭加载
							if(!alter_success){
								uni.showToast({
									title:this.$t("更改失败，请重新发送"),
									icon:"none"
								})
							}
						},10000)
						
						getApp().writeValueToBle(msg,str=>{
							if(count<this.deviceArr.length*2){
								if(str.search("[OK]")!=-1){  //返回的数据带有[OK],表明时间修改成功
									uni.hideLoading()  //主动关闭加载
									uni.showToast({
										title:this.$t("修改成功"),
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
							title: this.$t("请输入1~255之间的整数"),
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: this.$t("请输入1~255之间的整数"),
						icon: 'none'
					})
				}

			},
			test(){ 
				//单参数测试
				getApp().globalData.deviceArr.push({address:3,type:0,param:9})
				setTimeout(()=>{
					getApp().globalData.deviceArr.push({address:6,type:0,param:3})
				},250)
				setTimeout(()=>{
					getApp().globalData.deviceArr.push({address:16,type:0,param:4})
				},500)
				setTimeout(()=>{
					getApp().globalData.valueArr.push({param:4,address:16,value:20+Math.round(Math.random()*5),electric:4.164,testTime:3,interval:2})
					setInterval(()=>{
						getApp().globalData.valueArr.push(
							{param:9,address:3,value:Math.round(Math.random()*50),temperature:23.4,mud:3.4,bod:3.3,electric:3.764},
						)
						setTimeout(()=>{
							getApp().globalData.valueArr.push({param:3,address:6,value:9+Math.round(Math.random()*5),temperature:23.4,electric:3.264})
							setTimeout(()=>{
								getApp().globalData.valueArr.push({param:4,address:16,value:20-Math.round(Math.random()*40),electric:3.064})
							},1000)
						},1000)
					},3000)
				},1500)
				
				//多参数测试
				// getApp().globalData.deviceArr.push({address:3,type:1,param:4})
				// setTimeout(()=>{
				// 	setInterval(()=>{
				// 		getApp().globalData.valueArr.push(
				// 			{temperature:23.5,values:[Math.round(100*Math.random()),Math.round(100*Math.random()),24.3,12.3,-3.1,2,3,32],electric:3.764}
				// 		)
				// 	},3000)
				// },1500)
				

			},
			setChart(){
				this.deviceArr.forEach((item,index)=>{  //遍历设备数组
					if(index == this.deviceArr.length-1){
						let itemArr
						let categories = []
						let series_data = []
						let param_name
						let i=1
						let opts = JSON.parse(JSON.stringify(this.opts))
						if(item.type == 1){ //多参数情况
							opts.yAxis.data[0].title = '℃'
							param_name = ''
						}else{ //一般情况
							param_name = this.paramArr[this.deviceArr[index].param]

						}
						
						if(!(item.type ==0 && this.deviceArr[index].param==4)){ //单参数ORP不设0为下限
							opts.yAxis.data[0].min = 0
						}
					
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
						this.optsArr[index] = opts
					}
					
				})
			},
			
			setElectric(){
				if(this.valueArr.length>0){
					let electric = this.valueArr[this.valueArr.length-1].electric
					let percent
					if(electric>4.2){
						percent = 100
					}else if(electric>3.4){ //3.4~4.2,对应电量5~100
						percent = Math.round(118.75*electric-398.75) 
					}else if(electric>2.9){ //2.9~3.4，对应电量0~5
						percent = Math.round(10*electric-29)
					}else{
						percent = 0
					}

					this.eq = percent
					if(percent>80){
						this.batteryColor = 'greenyellow'
					}else if(percent>50){
						this.batteryColor = 'yellow'
					}else if(percent>20){
						this.batteryColor = 'orange'
					}else{ //0~20
						this.batteryColor = 'orangered'
					}
					

				}
			},
			showOrFold(index){
				// this.showItem=index
				let flag = !this.chartDisplay[index]
				this.$set(this.chartDisplay,index,flag)
				if(flag){
					if(!this.chartDataArr[index].series[0].name){
						let name
						let type = this.lightOptions[index]
						if(type == 1){
							name = this.$t("温度")
						}else if(type == 2){
							name = this.$t("浊度")
						}else if(type == 3){
							name = "BOD"
						}else{
							name = this.$t(this.paramArr[this.deviceArr[index].param]) 
						}
						this.chartDataArr[index].series[0].name = name
					}
				}
			},
			switchChart(index,type){
				this.$set(this.lightOptions,index,type)
				// let itemArr = this.valueArr.slice(-10).filter((item)=>{return (item.param == this.deviceArr[index].param) && (item.address?(item.address==this.deviceArr[index].address):true)})  //取到索引对应传感器的值的数组
				let itemArr = this.valueArr.slice(-this.limit*10).filter((item)=>{return (item.param == this.deviceArr[index].param) && (item.address?(item.address==this.deviceArr[index].address):true)})  //减小筛选范围
				itemArr = itemArr.slice(-this.limit) //取数组后面的limit位
				let tempArr = []
				let name = "" //点击某一项时，显示的参数名称
				if(type == 1){
					tempArr = itemArr.map(item=>{return item.temperature})
					name = this.$t("温度")
				}
				else if(type == 2){
					tempArr = itemArr.map(item=>{return item.mud})
					name = this.$t("浊度")
				}
				else if(type == 3){
					tempArr = itemArr.map(item=>{return item.bod})
					name = "BOD"
				}
				else{
					tempArr = itemArr.map(item=>{return item.value}) 
					name = this.$t(this.paramArr[this.deviceArr[index].param]) 
				} //type为0的情况，即化学参数
				
				this.chartDataArr[index] = {
					//categories和默认参数是一样的，不用设置
					categories:this.chartDataArr[index].categories,
					series: [
					  {
						data: tempArr,
						textColor:'#aaa',
						name:name
					  }
					] 
				}
				this.alterChartMax(index)
				
			},
			//打开时间校准
			toAlterTime(){
				this.open_alter_time_popup()
			},
			alterChartMax(index){ //动态修改折线图上限
				let newData = this.chartDataArr[index].series[0].data
				// if((this.deviceArr[index].type==0 && this.deviceArr[index].param==4) || 
				// (this.deviceArr[index].type==1)&&( (this.manyParamsConfig?this.manyParamsConfig[this.manyParamLightOption-1]:this.originalManyParamsConfig[this.manyParamLightOption])=="ORP")){ //orp可以显示正数或负数，不做动态范围调整
				// 	console.log("选到了ORP")
				// 	let min = Math.min.apply(null,newData)
				// 	console.log(min)
				// 	if(min<0){
				// 		this.optsArr[index].yAxis.data[0].max = min
				// 	}
				// }
				let average = 0
				for(let num of newData){
					average+=num
				}
				average = average/newData.length
				let max = Math.max.apply(null,newData)
			
				let chart_max
				if(average*2>max){
					// chart_max = Math.ceil(average*2)+(5-Math.ceil(average*2)%5)
					chart_max = Math.ceil(average*2)+((5-Math.ceil(average*2)%5)==5?0:(5-Math.ceil(average*2)%5))
				}else{
					chart_max = max+(5-max%5)
				}
				
				//限制ph上限为15
				if((this.deviceArr[index].type==1&& (this.manyParamsConfig?this.manyParamsConfig[this.manyParamLightOption-1]:this.originalManyParamsConfig[this.manyParamLightOption]))=='pH' 
				|| (this.lightOptions[index]==0 && this.deviceArr[index].param == 3)){
					if(chart_max>15 && max<=15){
						chart_max = 15
					}
				}
				
				if(this.optsArr[index].yAxis.data[0].max != chart_max){
					this.optsArr[index].yAxis.data[0].max = chart_max
				}
			}
			
			
		},
		
		watch:{
			deviceArr(){ //监听到deviceArr发生变化后，要重构图表列表
				console.log('deviceArr更新了')
				if(this.deviceArr.length==1){
					console.log('获取到第一个设备类型')
					getApp().globalData.firstLoading = false //30后突然又加载到数据，重新进也不能发f900
					this.showLoading = false //获取到第一个传感器就关闭加载动画
					this.closeWaitingPopup("成功获取设备类型")
				}
				this.setChart()
			},
			valueArr(){ //valueArr加入新数据后，要对相应折线图的数据重新赋值
				// console.log('valueArr发送了变化')
				if(this.homeConfig.waitFirstValue){ //如果等待花括号数据的加载动画还在显示，则关闭
					this.homeConfig.waitFirstValue = false
				}
				if(this.valueArr.length % 10 == 1){ //从无到有的第一条，要设置一次电量,往后每10条重设一次电量
					this.setElectric()
				}
				if(this.valueArr.length){ //接单参数的情况

					if(this.deviceArr[0] && this.deviceArr[0].type == 1){ //接多参数的情况,多参数的情况下设备列表只能有一支
						//给多参数折线图chartdata赋值的逻辑写在这里
						let newValue = this.valueArr[this.valueArr.length-1]
						if(newValue){
							let insertValue
							if(this.manyParamLightOption==-1){ //当前显示的是温度
								insertValue = newValue.temperature
							}else{
								insertValue = newValue.values[this.manyParamLightOption]
							}
							let categories = this.chartDataArr[0].categories
							let data = this.chartDataArr[0].series[0].data
							this.chartDataArr[0] = {
								categories:[...categories.length>=this.limit?categories.slice(1,categories.length):categories,categories[categories.length-1]?(categories[categories.length-1]+1):1],
								series: [
								  {
									data: [...data.length>=this.limit?data.slice(-this.limit+1):data,insertValue],
									textColor:'#aaa'
								  }
								]
							}
							this.alterChartMax(0)
						}
					}else{ //接单参数的情况
						let newValue = this.valueArr[this.valueArr.length-1]
						let index = this.deviceArr.findIndex((item)=>{return (item.param==newValue.param) && (newValue.address?(item.address == newValue.address):true)}) //根据param获取新数据在列表中的索引
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
						
						let categories = this.chartDataArr[index].categories
						let data = this.chartDataArr[index].series[0].data
						this.chartDataArr[index] = {
						
							categories:[...categories.length>=this.limit?categories.slice(1,categories.length):categories,categories[categories.length-1]?(categories[categories.length-1]+1):1],
							series: [
							  {
								data: [...data.length>=this.limit?data.slice(-this.limit+1):data,insertValue],
								textColor:'#aaa'
							  }
							]
						}
						
						this.alterChartMax(index)
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
		// border: 3rpx solid lightgray;
		border-radius: 25rpx;
	}
	.chart_view{
		padding: 10rpx;
		border-radius: 15rpx;
		margin: 20rpx 15rpx;
		// border: 3rpx solid lightgray;
		background-color: white;

	}
	.time_style{
		height: 70rpx;width: 50%;text-align: center;line-height: 70rpx;
	}

	.item{
		text-align: center;line-height: 40rpx;font-size: 25rpx;width: 33%;margin-bottom: 30rpx;
	}
	
	.head{
		margin: 15rpx 0rpx;background-image: linear-gradient(to bottom right,skyblue,white);height: 150rpx;width: 150rpx;border-radius: 75rpx;
		font-weight: 800;font-size: 35rpx;color: dimgray;display: flex;align-items: center;justify-content: center;text-align: center;
		
	}
	.outer{
		padding: 30rpx;
		/*#ifndef MP*/  //小程序下背景无效
		background-image: url('../../static/background.jpg'); 
	    /*#endif*/
		background-size: 100% auto;
		background-repeat: no-repeat;
		min-height: 500rpx;
	}
	
	.son_param_row{
		 // width: 80%;
		 width: 100%;
		 .right_son_param{
		 	width: 240rpx;
		 }
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
	.unit{
		margin-left: 5rpx;
		font-size: 25rpx;
	}
	.shadow{
		
		box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
	}
</style>