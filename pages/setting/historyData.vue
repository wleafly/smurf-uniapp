<template>

	<view class="outer">
		<view class="box">
			<view style="font-size: 35rpx;">参数概况</view>
			<view style="display: flex;flex-wrap: wrap;">
				<view v-for="paramId in includeParamArr" style="width: 25%;padding: 20rpx 0;" @click="selectParam(paramId)">
					<view :style="selectOption==paramId?'color:#89B7EC':''" style="font-size: 35rpx;">{{paramArr[paramId]}}</view>
					<view style="font-size: 20rpx;color: gray;">条数:{{valueArr.filter(value=>{return value[1]==paramId}).length}}</view>
				</view>
				<!-- 多参数单独处理 -->
				<view v-if="manyParamValueArr.length" style="width: 25%;padding: 20rpx 0;" @click="selectParam(0)"> 
					<view style="font-size: 35rpx;" :style="selectOption==0?'color:#89B7EC':''">多参数</view>
					<!-- 条数0可以隐藏 -->
					<view style="font-size: 20rpx;color: gray;">条数:{{manyParamValueArr.length}}</view>
				</view>
	
			</view>
		</view>
		<view class="box" style="margin-top: 30rpx;">
			<view style="font-size: 35rpx;">变化趋势</view>
			<view style="display: flex;margin-top: 20rpx;margin-bottom: 30rpx;">
				<view class="attribute" >
					可选参数
				</view>
				<view style="display: flex;flex-wrap: wrap;width: 80%;">
					<view v-for="option,index in optionalParams" style="width: 30%;padding: 5rpx;min-height: 50rpx;margin-bottom: 5rpx;">
						<view @click="selectSonParam(index)" :style="sonParamIndex==index?'background-color: #eee':''" class="param_option">{{option}}</view>
					</view>
				</view>
			</view>

			
			<qiun-data-charts type="line" :chartData="chartData" :opts="opts" :ontouch="true"/>
			<!-- <button @click="addData">加数据</button> -->
			<button @click="" style="margin: 20rpx 0">下载历史数据</button>
			<button @click="deleteData()" >删除历史数据</button>
			<!-- <button @click="clickBtn1">发送F6</button> -->
			<button @click="clickBtn2" style="margin: 20rpx 0">获取历史数据</button>
	
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return{
				tempStr:"",
				sonParamIndex:0,
				optionalParams:[],
				selectOption:-1, //选中的参数的参数id
				isNewDevice:true,
				includeParamArr:[],  //集合，历史数据中包含的参数类型id
				valueArr:[],
				manyParamValueArr:[],  
				paramArr:["","DDM_μ","DDM_m","PHG","ORP","RDO","ION","ZS","DDM_S","COD","CL","CHLO","BGA","TPS","TSS","OIL","BOD"],
				unitArr:["","μS/cm","mS/cm","","mV","mg/L","mg/L","NTU","PSU","mg/L","mg/L","μg/L","Kcells/mL","mm","mg/L","mg/L",""],
				chartData: {
					categories:[],
					series: [
					  {
						data: [],
						textColor:'#aaa',
						name:"" //参数名，点击某一项会显示该name和值
					  },
					  
					]
				},
				opts: {
					enableScroll: true,
					update:true,
					legend: {show:false},
					animation:false,
					duration:0,	
					// scrollPosition:'right',
					xAxis: {
					  itemCount: 8  //x轴最多同时显示几个
					},
					yAxis: {
						showTitle:true,
						data: [{
							title: "单位", //纵坐标单位
							// tofix: 0, //保留几位小数，0表示随数据自动调整
							// min:0,
							// max:100
						}]
					}
				},
				manyParamContent:["温度","COD","COD内置浊度","电导率/盐度","PH","ORP","溶解氧","NHN","浊度"],
				manyParamUnit:["℃","mg/L","mg/L","PSU","","mV","mg/L","mg/L","NTU"]
			}
		},
		onShow() {
			let that = this
			getApp().writeValueToBle("F6",str=>{
				if(str.startsWith("[")&&str.endsWith("]")){
					console.log(str)
					let count = parseInt(str.substring(1,str.length-1))
					console.log(count)

					if(count<200){
						getApp().writeValueToBle("FB",str=>{
							that.handleStr(str)
						})
					}else{
						uni.showModal({
							content:`共发现${count}条历史数据，读取约耗时${count*0.047}秒，是否要读取`,
							success(res) {
								if(res.confirm){
									console.log("你点击了确定")
									getApp().writeValueToBle("FB",str=>{
										that.handleStr(str)
									})
								}
							}
						})
					}
					
				}
				
			})
		},
		methods: {	
			deleteData(){
				uni.showModal({
					content:"是否清除历史记录",
					success(res) {
						if(res.confirm){
							getApp().writeValueToBle("FD",str=>{
							})
						}
					}
				})

			},
			clickBtn2(){ //手动发送FB请求
				getApp().writeValueToBle("FB",str=>{
					this.handleStr(str)
				})
			},
			selectParam(paramId){
				this.sonParamIndex = 0
				this.selectOption = paramId
				if(paramId==4){
					this.optionalParams = ["ORP"]
				}else if(paramId==9){
					this.optionalParams = ["COD","温度","浊度","BOD"]
				}else if(paramId==0){  //多参数
					this.optionalParams = this.manyParamContent
					
				}else{ //一般情况
					this.optionalParams = [this.paramArr[paramId],"温度"]
				}
				this.selectSonParam(0)
				if(paramId!=0){  //设置纵坐标单位
					this.opts.yAxis.data[0].title = this.unitArr[paramId]
				}else{ //多参数第一个是温度
					this.opts.yAxis.data[0].title = "℃"
				}
			},
			selectSonParam(index){
				if(this.selectOption!=0){ //选择单参数传感器的某一子参数时
					if(index == 1){
						this.opts.yAxis.data[0].title = "℃"
					}else if(index==2){
						this.opts.yAxis.data[0].title = "NTU"
					}else if(index==3){
						this.opts.yAxis.data[0].title = "mg/L"
					}
				}else{ //多参数的单位有特定安排
					this.opts.yAxis.data[0].title = this.manyParamUnit[index]
				}
				// console.log(this.selectOption)
				// console.log(index)
				this.sonParamIndex = index
				let needArr
				let data
				if(this.selectOption != 0){ //普通传感器数据，单参数
					needArr = this.valueArr.filter((item)=>item[1]==this.selectOption)
					data = needArr.map(item=>{return item[2+index]})
				}else{ //多参数设备
					needArr = this.manyParamValueArr
					data = this.manyParamValueArr.map(item=>{return item[2+index]})
				}
				// console.log(needArr)
				let categories = []
				for(var i = 1;i<=needArr.length;i++){
					categories.push(i)
				}
				let chartData = {
					categories: categories,
					
					series: [
					  {
						data: data,
						textColor:'#aaa',
						name:"" //参数名，点击某一项会显示该name和值
					  },
					  
					]
				}
				this.chartData = chartData
			
			},
			addData(){
				let tempArr
				let timer = setInterval(()=>{
				
					switch(Math.round(3*Math.random())){
						case 0:  //一般数据
							tempArr = [0,Math.round(5+2*Math.random()),4,Math.round(100*Math.random()),Math.round(200+Math.random()*100)/10,0,0]
							break
						case 1:  //ORP
							tempArr = [0,4,16,Math.round(100*Math.random()),0,0,0]
							break
						case 2:  //COD
							tempArr = [0,9,3,Math.round(100*Math.random()),Math.round(200+Math.random()*100)/10,Math.round(100*Math.random()),Math.round(100*Math.random())]
							break
						case 3:  //多参数
							tempArr = [1,4,0,23.4,Math.round(100*Math.random()),6,37.5,-2,5.5,321,23,40.8] 
					}
					this.handleArr(tempArr)
				},50)
				
				setTimeout(()=>{
					clearInterval(timer)
				
				},5000)
			},

			handleStr(str){
				console.log("收到数据:"+str)
				if(str.startsWith("[") && str.endsWith("]")){  //完整数据，可直接转化为数组
					this.strToNumArr(str)
				}else if(str.startsWith("[") && !str.endsWith("]")){ //不完整数据的前半段
					this.tempStr = str
				}else if(!str.startsWith("[")){ //不完整数据的后半段
					this.tempStr = this.tempStr + str
					if(str.endsWith("]")){ //拼上后半段变成完整数据的情况
						this.strToNumArr(this.tempStr)
					}
				}
			},
			handleArr(arr){
				if(this.isNewDevice){
					arr.splice(2,1) //移除地址。统一数据格式
				}
				if(arr[0]==0){
					if(this.includeParamArr.indexOf(arr[1])==-1){ //如果是第一次识别到的参数，加入参数队列中
						this.includeParamArr.push(arr[1])
					}
					this.valueArr.push(arr)
				}else if(arr[0]==1){
					this.manyParamValueArr.push(arr)
				}
			},
			strToNumArr(str){
				let strArr = str.slice(1,str.length-2).split(',')
				if(strArr.indexOf("")!=-1){ //存在空数据，代表垃圾数据
					return
				}
				let arr = strArr.map(Number)

				if(arr[0]==0 || arr[0]==1){ //无论新老设备，类型一定是0或1，代表单参数还是多参数
					if(arr[0]==0 && (arr[1]<1 || arr[1]>16)){
						return
					}
					if(arr[0]==0 && arr[1]!=9 && (arr[arr.length-1]!=0 || arr[arr.length-2]!=0)){ //单参数如果不是cod，后面两项为0，否则是假数据
						return
					}
			
					console.log("处理后的历史数据：",arr)
					this.handleArr(arr)
				}
				
			}
			
		}
	}
</script>

<style>
	page {
		background-color: #eee;
	}
	
	.param_option{
		border: 1rpx solid lightgray;text-align: center;border-radius: 10rpx;height: 100%;display: flex;justify-content: center;align-items: center;
	}

	.outer {
		padding: 20rpx;
	}

	.box {
		background-color: white;
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.num_input {
		border: 1rpx solid lightgray;
		border-radius: 10rpx;
		width: 100rpx;
		text-align: center;
	}
	.attribute{
		width: 20%;color: gray;display: flex;align-items: center;
	}
	.value_attr{
		color: gray;margin-bottom: 20rpx;
	}

</style>