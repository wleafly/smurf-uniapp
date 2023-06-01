<template>

	<view class="outer">
		<view class="box">
			<view style="font-size: 35rpx;">{{$t('参数概况')}}</view>
			<view style="display: flex;flex-wrap: wrap;">
				<view v-for="paramId in includeParamArr" style="width: 25%;padding: 20rpx 0;" @click="selectParam(paramId)">
					<view :style="selectOption==paramId?'color:#89B7EC;font-weight: bold':''" style="font-size: 35rpx;">{{$t(paramArr[paramId])}}</view>
					<view style="font-size: 20rpx;color: gray;">{{$t('条数')}}:{{normalValueArr.filter(value=>{return value[1]==paramId}).length}}</view>
				</view>
				<!-- 多参数单独处理 -->
				<view v-if="manyParamValueArr.length" style="width: 25%;padding: 20rpx 0;" @click="selectParam(0)"> 
					<view style="font-size: 35rpx;" :style="selectOption==0?'color:#89B7EC;font-weight: bold':''">{{$t('多参数')}}</view>
					<!-- 条数0可以隐藏 -->
					<view style="font-size: 20rpx;color: gray;">{{$t('条数')}}:{{manyParamValueArr.length}}</view>
				</view>
	
			</view>
		</view>
		<view class="box" style="margin-top: 30rpx;">
			<view style="font-size: 35rpx;">{{$t('变化趋势')}}</view>
			<view style="display: flex;margin-top: 20rpx;margin-bottom: 30rpx;">
				<view class="attribute" >
					{{$t('可选参数')}}
				</view>
				<view style="display: flex;flex-wrap: wrap;width: 80%;">
					<view v-for="option,index in optionalParams" style="width: 30%;padding: 5rpx;min-height: 50rpx;margin-bottom: 5rpx;font-size: 25rpx;">
						<view @click="selectSonParam(index)" :style="sonParamIndex==index?'background-color: #eee':''" class="param_option">{{$t(option)}}</view>
					</view>
				</view>
			</view>

			
			<qiun-data-charts type="line" :chartData="chartData" :opts="opts" :ontouch="true"/>
			<!-- <button @click="addData" style="margin-top: 20rpx;">添加假数据</button> -->
			<view style="display: flex;margin-top: 50rpx;justify-content: space-between;">
				<button @click="deleteData()" style="width: 45%;background-color: #ff6363;color: white;font-weight: bold;">{{$t("删除历史数据")}}</button>
				<button @click="downloadData()" style="width: 45%;background-color: #89B7EC;color: white;font-weight: bold;">{{$t("获取Excel表格")}}</button>
			</view>
			<!-- <button @click="clickF6">发送F6</button> -->
			<!-- <button @click="clickFB">模拟发送FB</button> -->
			<!-- <button @click="clickFBTrue" style="margin: 20rpx 0">FB获取历史数据</button> -->
	
		</view>
	</view>

</template>

<script>
	import * as XLSX from '../../static/excel.js'
	export default {
		data() {
			return{
				tempStr:"",
				sonParamIndex:0,
				optionalParams:[],
				selectOption:-1, //选中的参数的参数id
				isNewDevice:null,
				includeParamArr:[],  //集合，历史数据中包含的参数类型id
				normalValueArr:[],
				manyParamValueArr:[],  
				paramArr:getApp().globalData.paramArr,
				unitArr:getApp().globalData.unitArr,

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
				manyParamContent:["温度",...getApp().globalData.originalManyParamsConfig],
				manyParamUnit:["℃",...getApp().globalData.originalManyParamsConfigUnit],
				manyParamsConfig:null
			}
		},
		onLoad(){			
			console.log("执行了onload方法")
			// let str = "["
			// console.log( parseInt(str) )
			// console.log(typeof parseInt(str))
			this.includeParamArr = getApp().globalData.includeParamArr
			this.normalValueArr = getApp().globalData.normalValueArr
			this.manyParamValueArr = getApp().globalData.manyParamValueArr
			this.manyParamsConfig = uni.getStorageSync("manyParamsConfig") //获取多参数参数表配置
		},
		onShow() {
		
			// this.addData()
			if(this.normalValueArr.length ==0 && this.manyParamValueArr.length ==0){ //历史数据没存过，自动发f6指令，询问用户要不要读数据
				let that = this
				let getNum = false
				setTimeout(()=>{
					if(!getNum){
						uni.showModal({
							content:that.$t("f6指令未读取到数据条数，是否仍要读取数据"),
							success(res) {
								if(res.confirm){
									console.log("发送FB")
									getApp().writeValueToBle("FB",str=>{
										that.handleStr(str)
									})
								}
							}
						})
					}
				},3000)
				getApp().writeValueToBle("F6",str=>{
					console.log(str)
					if(/^\[\d+\]/.test(str)){
						let count = parseInt(str.split("[")[1].split("]")[0])
						if(count && typeof count == "number"){
							getNum = true
							if(count<200){
								getApp().writeValueToBle("FB",str=>{
									that.handleStr(str)
								})
							}else{
								uni.showModal({
									content:`${that.$t("共发现")}${count}${that.$t("条历史数据，读取约耗时")}${count*0.047}${that.$t("秒，是否要读取")}`,
									success(res) {
										if(res.confirm){
											console.log("发送FB")
											getApp().writeValueToBle("FB",str=>{
												that.handleStr(str)
											})
										}
									}
								})
							}
						}
						
						
					}
					
				})
			}
			
		},
		methods: {	
			clickF6(){
				getApp().writeValueToBle("f6",str=>{
					console.log(str)
				},()=>{
					console.log("写f6失败")
				})
			},
			clickFBTrue(){
				getApp().writeValueToBle("FB",str=>{
					that.handleStr(str)
				})
			},
			clickFB(){
				this.addData()
			},
			downloadData(){
				/*#ifdef MP*/
				const workbook = XLSX.utils.book_new();
				for(let paramId of this.includeParamArr){
					let needArr = this.normalValueArr.filter((item)=>{return item[1] == paramId})
					let head = [$t("序号"),`${this.$t(this.paramArr[paramId])}(${this.unitArr[paramId]})`,this.$t("温度")+"(℃)"]  //excel表头
					if(paramId==4){
						head.pop()
					}else if(paramId == 9){
						head = [...head,...[this.$t("浊度")+"(NTU)","BOD(mg/L)"]]
					}
					let resultArr = [head]
					if(paramId == 4){
						needArr.forEach((value,index)=>{
							resultArr.push([index+1,value[2]])
						})
					}else if(paramId == 9){
						needArr.forEach((value,index)=>{
							resultArr.push([index+1,value[2],value[3],value[4],value[5]])
						})
					}else{
						needArr.forEach((value,index)=>{
							resultArr.push([index+1,value[2],value[3]])
						})
					}
					// console.log(this.paramArr[paramId],resultArr) //表名和数据
					XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(resultArr), this.$t(this.paramArr[paramId]));
				}
				
				if(this.manyParamValueArr.length){
					let head = []
					if(this.manyParamsConfig){
						head = [this.$t("温度")+'(℃)', 'COD(mg/L)', this.$t('COD内置浊度')+'(mg/L)']
						this.manyParamsConfig.forEach((item,index)=>{
							if(index>0){
								head[index+2] = `${this.$t(item)}(${getApp().globalData.manyParamCustomUnits[getApp().globalData.manyParamCustomOptions.findIndex((option)=>{return option == item})]})`
							}
						})
					}else{
						this.manyParamContent.forEach((item,index)=>{
							head[index] = `${this.$t(item)}(${this.manyParamUnit[index]})`
						})
					}
					head.unshift(this.$t("序号")) //向开头添加元素用unshift
					let resultArr = [head]
					this.manyParamValueArr.forEach((value,index)=>{
						resultArr.push([index+1,...value.slice(2,value.length)])
					})
					// console.log("多参数",resultArr)
					XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(resultArr),this.$t('多参数'));
				}
				
				const fileData = XLSX.write(workbook, {
					bookType: "xlsx",
					type: 'base64'
				});
				const filePath = `${wx.env.USER_DATA_PATH}/${this.$t('历史数据')}${getDateTime.dateTimeStr('y-m-d h:i:s')}.xlsx` // 文件名对应表名，多个表的情况可以自己测试
				const fs = wx.getFileSystemManager()
				console.log(filePath)
				fs.writeFile({
					filePath: filePath,
					data: fileData,
					encoding: 'base64',
					success: res => {
						console.log('写文件成功', res)
						const sysInfo = wx.getSystemInfoSync()
						if (sysInfo.platform.toLowerCase().indexOf('windows') >= 0) {
							wx.saveFileToDisk({
								filePath: filePath,
								success: console.log,
								fail: console.error
							})
						} else {
							wx.openDocument({
								filePath: filePath,
								showMenu: true, // 需要添加showMenu允许用户导出
								success: console.log,
								fail: console.error
							})
						}
					},
					// fail: e => {
					// 	console.error(e)
					// 	if (e.errMsg.indexOf('locked')) {
					// 		wx.showModal({
					// 			title: '提示',
					// 			content: '文档已打开，请先关闭',
					// 		})
					// 	}
					// }
				})
				
				/*#endif*/
			},
			deleteData(){
				uni.showModal({
					content:this.$t("是否清除历史记录"),
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
					
					if(this.manyParamsConfig){
						this.optionalParams = [...this.manyParamContent.slice(0,3),...this.manyParamsConfig.slice(1,this.manyParamsConfig.length)]
					}else{
						this.optionalParams = this.manyParamContent
					}
					

					
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
					}else if(index == 0){
						this.opts.yAxis.data[0].title = this.unitArr[this.selectOption]
					}
				}else{ //多参数的单位有特定安排
					if(this.manyParamsConfig && index >2){ //不是前三项，要用自定义的单位
						this.opts.yAxis.data[0].title = getApp().globalData.manyParamCustomUnits[getApp().globalData.manyParamCustomOptions.findIndex((option)=>{return option == this.manyParamsConfig[index-2]})]
					}else{
						this.opts.yAxis.data[0].title = this.manyParamUnit[index]
					}
				}
				// console.log(this.selectOption)
				// console.log(index)
				this.sonParamIndex = index
				let needArr
				let data
				if(this.selectOption != 0){ //普通传感器数据，单参数
					needArr = this.normalValueArr.filter((item)=>item[1]==this.selectOption)
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
			addData(){ //模拟用假数据
				let tempArr
				let timer = setInterval(()=>{
					
					// switch(Math.round(3*Math.random())){
					// 	case 0:  //一般数据
					// 		tempArr = "[0,8,4,21,22,0,0,]"
					// 		break
					// 	case 1:  //ORP
					// 		tempArr = "[0,4,16,32,0,0,0,]"
					// 		break
					// 	case 2:  //COD
					// 		tempArr = "[0,9,3,32,54,43,1,]"
					// 		break
					// 	case 3:  //多参数
					// 		tempArr = "[1,4,0,23.4,6,6,37.5,-2,5.5,321,23,40.8,]"
					// }
					// this.strToNumArr(tempArr)
					
					switch(Math.round(3*Math.random())){
						case 0:  //一般数据
							tempArr = "[0,8,21,22,]"
							break
						case 1:  //ORP
							tempArr = "[0,4,32,]"
							break
						case 2:  //COD
							tempArr = "[0,9,3,32,54,43,1,]"
							break
						case 3:  //多参数
							tempArr = "[1,4,23.4,6,6,37.5,-2,5.5,321,23,40.8,]"
					}
					this.strToNumArr(tempArr)
					
					// this.isNewDevice = true
					// switch(Math.round(3*Math.random())){
					// 	case 0:  //一般数据
					// 		tempArr = [0,8,4,Math.round(100*Math.random()),Math.round(200+Math.random()*100)/10,0,0]
					// 		break
					// 	case 1:  //ORP
					// 		tempArr = [0,4,16,Math.round(100*Math.random()),0,0,0]
					// 		break
					// 	case 2:  //COD
					// 		tempArr = [0,9,3,Math.round(100*Math.random()),Math.round(200+Math.random()*100)/10,Math.round(100*Math.random()),Math.round(100*Math.random())]
					// 		break
					// 	case 3:  //多参数
					// 		tempArr = [1,4,0,23.4,Math.round(100*Math.random()),6,37.5,-2,5.5,321,23,40.8] 
					// }
					
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
				if(this.isNewDevice!=null){
					if(this.isNewDevice){
						arr.splice(2,1) //移除地址。统一数据格式
					}
					if(arr[0]==0){
						if(this.includeParamArr.indexOf(arr[1])==-1){ //如果是第一次识别到的参数，加入参数队列中
							this.includeParamArr.push(arr[1])
						}
						this.normalValueArr.push(arr)
					}else if(arr[0]==1){
						this.manyParamValueArr.push(arr)
					}
				}

			},
			strToNumArr(str){
				let strArr = str.slice(1,str.length-2).split(',')
				if(strArr.indexOf("")!=-1){ //存在空数据，代表垃圾数据
					return
				}
				let arr = strArr.map(Number)

				if((arr[0]==0 && arr[1]>0 && arr[1]<20)|| (arr[0]==1 && arr.length>10)){ //无论新老设备，类型一定是0或1，代表单参数还是多参数

					console.log("处理后的历史数据：",arr)
					if(this.isNewDevice==null){
						if(arr[0]==0){ //不是cod的单参数
							if(arr.length==7){
								this.isNewDevice = true
							}
							if(arr.length==3 || arr.length==4 || arr.length==6){
								this.isNewDevice = false
							}
						}
						if(arr[0]==1){
							if(arr.length==12){
								this.isNewDevice = true
							}
							if(arr.length==11){
								this.isNewDevice = false
							}
						}
						
					}
					
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
		width: 20%;color: gray;display: flex;
	}
	.value_attr{
		color: gray;margin-bottom: 20rpx;
	}

</style>