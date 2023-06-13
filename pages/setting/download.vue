<template>
	<view style="margin: 20rpx;">
		<view style="display: flex;align-items: center;">
			<view class="attribute" >{{$t('日期筛选')}}</view>
			<picker style="background-color: #eee;padding: 10rpx 20rpx;border-radius: 10rpx;" @change="bindDateChange" :range="dateArr">
				<view style="display: flex;">{{selectedDate?selectedDate:$t("请选择日期")}}<u-icon name="arrow-down"></u-icon></view>
			</picker>
		</view>
		
		<view style="display: flex;align-items: center;margin: 20rpx 0;">
			<view class="attribute" >{{$t('时间段筛选')}}</view>
			<picker style="background-color: #eee;padding: 10rpx 20rpx;border-radius: 10rpx;" @change="bindTimeChange" :range="timeArr">
				<view style="display: flex;">{{selectedTime?selectedTime:$t("请选择时间段")}}<u-icon name="arrow-down"></u-icon></view>
			</picker>
		</view>
		
		<view style="display: flex;align-items: center;">
			<view class="attribute" >{{$t('传感器类型')}}</view>
			<view style="display: flex;flex-wrap: wrap;width: 75%;">
				<view v-for="sensor,index in sensorArr" style="width: 30%;padding: 5rpx;min-height: 50rpx;margin-bottom: 5rpx;" @click="selectSensor(index)">
					<view :style="index==selectedSensorIndex?'background-color: #eee':''" class="param_option">{{$t(paramArr[sensor])}}</view>
				</view>
			</view>
		</view>
		
		<scroll-view scroll-y style="max-height: 850rpx;">
			
			<uni-table v-if="tableData && tableData.length && tableData[0].param" :border="true"  style="margin-top: 20rpx;">	
				<!-- 单参数表头 -->
				<uni-tr>
					<uni-th>{{$t('序号')}}</uni-th>
					<uni-th>{{$t(paramArr[tableData[0].param])+"("+unitArr[tableData[0].param]+")"}}</uni-th>
					<uni-th v-if="tableData[0].param!=4">{{$t('温度')}}(℃)</uni-th>
					<uni-th v-if="tableData[0].param==9">{{$t('浊度')}}(NTU)</uni-th>
					<uni-th v-if="tableData[0].param==9">BOD(mg/L)</uni-th>
					<uni-th>{{$t("时间")}}</uni-th>
				</uni-tr>
				
				<uni-tr v-for="item,index in tableData">
					<uni-td>{{(pageNum-1)*200+index+1}}</uni-td>
					<uni-td>{{item.value}}</uni-td>
					<uni-td v-if="tableData[0].param!=4">{{item.temperature}}</uni-td>
					<uni-td v-if="tableData[0].param==9">{{item.mud}}</uni-td>
					<uni-td v-if="tableData[0].param==9">{{item.bod}}</uni-td>
					<uni-td>{{item.createTime?item.createTime.split(" ")[1]:''}}</uni-td>
				</uni-tr>
			</uni-table>
			
			<uni-table v-else-if="tableData && tableData.length" :border="true">
				
				<uni-tr v-if="!manyParamsActive">
					<uni-th>{{$t('序号')}}</uni-th>
					<uni-th>{{$t('温度')}}(℃)</uni-th>
					<uni-th v-for="param in manyParamsDefault">{{$t(param)+(unitMap.get(param)?`(${unitMap.get(param)})`:'')}}</uni-th>
					<uni-th>{{$t("时间")}}</uni-th>
				</uni-tr>
				
				<uni-tr v-else>
					<uni-th>{{$t('序号')}}</uni-th>
					<uni-th>{{$t('温度')}}(℃)</uni-th>
					<uni-th v-for="param in manyParamsActive">{{$t(param)+(unitMap.get(param)?`(${unitMap.get(param)})`:'')}}</uni-th>
					<uni-th>{{$t("时间")}}</uni-th>
				</uni-tr>
				
				
				<uni-tr v-for="item,index in tableData">
					<uni-td>{{(pageNum-1)*200+index+1}}</uni-td>
					<uni-td>{{item.temperature}}</uni-td>
					<uni-td v-for="value in item.values">{{value}}</uni-td>
					<uni-td>{{item.createTime?item.createTime.split(" ")[1]:''}}</uni-td>
				</uni-tr>
			</uni-table>

		</scroll-view>
		<view v-if="tableData.length" style="display: flex;justify-content: space-between;color: gray;margin: 10rpx;">
			<view @click="lastPage">上一页</view>
			<view style="display: flex;" @click="inputPageNum">
				<text style="color: #2979FF;">{{pageNum}}</text>/{{totalPages}}
				
			</view>
			<view @click="nextPage">下一页</view>
		</view>
		<button class="btn" style="background-color: #63ff63;" @click="downloadExcel">{{$t('生成Excel表格')}}</button>
		<button class="btn" style="background-color: #ffcd69;" @click="deleteOneDay">{{$t('删除该日数据')}}</button>
		<button class="btn" style="background-color: #ff6363;" @click="clearAll">{{$t('清除全部数据')}}</button>
		<!-- <button class="btn" style="background-color: #5500ff;" @click="manyTest">使用测试数据</button> -->
		
	</view>
</template>

<script>
	import getDateTime from '@/common/getdateTime.js'; 
	import * as XLSX from '../../static/excel.js';
	export default {
		data() {
			return {
				pageNum:1,//默认页数
				totalPages:1,//总页数
				// currentPage:1,//触发焦点时，记录当前的页数
				dateArr:[], //从缓存获取
				selectedDate:null,
				timeArr:[],
				selectedTime:null,
				wholeDayArr:[],
				partArr:[] ,//wholeDayArr加工后的数据，其元素也是数组类型
				sensorArr:[] ,//当前选定时间内用到的传感器
				sensorValuesArr:[],
				paramArr:[],
				unitArr:[],
				selectedSensorIndex:0,
				tableData:[],//下载的
				pageTableData:[],//页面显示的，最多200条
				manyParamsDefault:getApp().globalData.originalManyParamsConfig,
				unitMap:getApp().globalData.paramUnitMap,
				manyParamsActive:null
				
				
			}
		},
		methods: {
			sliceTableData(){ //每页截200条数据
				this.tableData = this.sensorValuesArr[this.sensorArr[this.selectedSensorIndex]].slice((this.pageNum-1)*200,this.pageNum*200)
			},
			inputPageNum(){
				let that = this
				uni.showModal({
					title:'输入跳转的页数',
					editable:true,
					success(res) {
						if(res.confirm){
							let num = parseInt(res.content)
							if(num!=NaN && num>0 && num<=that.totalPages && num!=that.pageNum){
								that.pageNum = num
								that.sliceTableData()
							}
						}
					}
				})
			},
			lastPage(){
				if(this.pageNum>1){
					this.pageNum--
					this.sliceTableData()
				}
				
			},
			nextPage(){
				if(this.pageNum<this.totalPages){
					this.pageNum++
				}
				this.sliceTableData()
			},
			manyTest(){
				for(let i=0;i<500; i++){
					this.wholeDayArr.push({
						"param": 4,
						"value": Math.round(Math.random()*100),
						"electric": 4.228,
						"createTime": "2023-05-23 13:59:10"
					})
					this.wholeDayArr.push({
						"param": 6,
						"value": Math.round(Math.random()*100),
						"temperature": 26.9,
						"electric": 4.228,
						"createTime": "2023-05-23 13:59:20"
					})
						
					this.wholeDayArr.push({
						"param": 9,
						"value": Math.round(Math.random()*100),
						"temperature": 26.9,
						"electric": 4.228,
						"mud": 0,
						"bod": 0,
						"createTime": "2023-05-23 13:59:25"
					})
		
					this.wholeDayArr.push({
						"temperature": 2.7,
						"values": [
							i,
							0,
							Math.round(Math.random()*100),
							Math.round(Math.random()*100),
							0,
							Math.round(Math.random()*100),
							0,
							Math.round(Math.random()*100)
						],
						"electric": 4.273,
						"createTime": "2023-05-23 16:51:28"
					})
						
					this.wholeDayArr.push({
						"temperature": 2.7,
						"values": [
							0,
							0,
							Math.round(Math.random()*100),
							Math.round(Math.random()*100),
							0,
							Math.round(Math.random()*100),
							0,
							Math.round(Math.random()*100)
						],
						"electric": 4.273,
						"createTime": "2023-05-23 16:51:28"
					})
						
				}

				// this.wholeDayArr=[...this.wholeDayArr,...this.wholeDayArr,...this.wholeDayArr,...this.wholeDayArr]
				
				this.bindTimeChange({
					detail:{
						value:0
					}
				})
				
			},
			deleteOneDay(){
				let that = this
				if(this.selectedDate){
					uni.showModal({
						content:`${that.$t('是否要删除')}${this.selectedDate}${that.$t('的实时数据')}`,
						success(res) {
							if(res.confirm){
								console.log("删除一天的数据")
								uni.removeStorageSync(that.selectedDate);
							}
						}
					})

				}

			},
			clearAll(){
				let that = this
				if(this.dateArr.length>0){
					uni.showModal({
						content:that.$t('是否要删除所有下载的数据'),
						success(res) {
							if(res.confirm){
								for(let date of that.dateArr){
									uni.removeStorageSync(date);
								}
								
							}
						}
					})
				
				}
				
				
			},
			downloadExcel(){
				const workbook = XLSX.utils.book_new();
				let paramType = ""
				// let tableData = this.tableData
				let tableData = this.sensorValuesArr[this.sensorArr[this.selectedSensorIndex]]
				if(tableData.length){
					let paramId = tableData[0].param
					if(paramId){ //单参数
						let excelData
						
						if(paramId==4){
							excelData = [[this.$t("序号"),"ORP(mV)",this.$t("时间")]]
						}else if(paramId==9){
							excelData = [[this.$t("序号"),"COD(mg/L)",this.$t("温度")+"(℃)",this.$t("浊度")+"(NTU)","BOD(mg/L)",this.$t("时间")]]
						}else{
							excelData = [[this.$t("序号"),`${this.$t(this.paramArr[paramId])}(${this.unitArr[paramId]})`,this.$t("温度")+"(℃)",this.$t("时间")]] 
						}
					
						for(let item of tableData){
							if(item.param==4){
								excelData.push([excelData.length,item.value,item.createTime])
							}else if(item.param==9){
								excelData.push([excelData.length,item.value,item.temperature,item.mud,item.bod,item.createTime])
							}else{
								excelData.push([excelData.length,item.value,item.temperature,item.createTime])
							}
						}
						// console.log(excelData)
						paramType = this.paramArr[paramId].replace("/"," ") //表名和文件名不能带/
						XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(excelData), paramType);
					}else{ //多参数
						let excelData
						let manyParamsHeadWithUnit = []
						if(this.manyParamsActive){
							for(let i of this.manyParamsActive){
								manyParamsHeadWithUnit.push(this.$t(i)+(this.unitMap.get(i)?`(${this.unitMap.get(i)})`:''))
							} 
		
						}else{
							for(let i of this.manyParamsDefault){
								manyParamsHeadWithUnit.push(this.$t(i)+(this.unitMap.get(i)?`(${this.unitMap.get(i)})`:''))
							} 
						}
						excelData = [[this.$t("序号"),this.$t("温度")+"(℃)",...manyParamsHeadWithUnit,this.$t("时间")]]
						for(let item of tableData){
							excelData.push([excelData.length,item.temperature,...item.values,item.createTime])
						}
						// console.log(excelData)
						paramType = this.$t("多参数")
						XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(excelData), this.$t("多参数"));
					}
				}
				
				/*#ifdef MP*/
				const fileData = XLSX.write(workbook, {
					bookType: "xlsx",
					type: 'base64'
				});
				const filePath = `${wx.env.USER_DATA_PATH}/${paramType}${this.$t('实时数据')}${this.selectedDate+" "+this.selectedTime}.xlsx` // 文件名对应表名，多个表的情况可以自己测试
				const fs = wx.getFileSystemManager()
				fs.writeFile({
					filePath: filePath,
					data: fileData,
					encoding: 'base64',
					success: res => {
						wx.openDocument({
							filePath: filePath,
							showMenu: true // 需要添加showMenu允许用户导出
						})
					}
				})

				/*#endif*/
			},
			selectSensor(index){
				this.selectedSensorIndex = index
				let sensorData = this.sensorValuesArr[this.sensorArr[index]]
				this.pageNum = 1
				this.totalPages = Math.ceil(sensorData.length/200) //计算页数
				this.tableData = sensorData.slice(0,200)
				// console.log(this.tableData)
			},
			bindDateChange(e){
				this.selectedDate = this.dateArr[e.detail.value]
				this.wholeDayArr = uni.getStorageSync(this.selectedDate)
				// console.log('wholeDayArr',this.wholeDayArr)
				if(this.wholeDayArr){
					let nodeArr = []
					this.timeArr = [this.$t('全天')]
					
					this.wholeDayArr.forEach((value,index)=>{
						if(value.testTime){
							nodeArr.push(index)
						}
					})
					if(nodeArr[0]!=0){
						let part = this.wholeDayArr.slice(0,nodeArr[0])
						this.partArr.push(part)
						this.timeArr.push(part[0].createTime.split(" ")[1]+" ~ "+part[part.length-1].createTime.split(" ")[1])	
					}
					
					for(let i=0;i<nodeArr.length;i++){
						let part
						if(i!=nodeArr.length-1){
							part = this.wholeDayArr.slice(nodeArr[i],nodeArr[i+1])
						}else{
							part = this.wholeDayArr.slice(nodeArr[i],this.wholeDayArr.length)
						}
						this.partArr.push(part)
						this.timeArr.push(part[0].createTime.split(" ")[1]+" ~ "+part[part.length-1].createTime.split(" ")[1])
					}
				}
				
				
				// console.log(this.partArr)
				// console.log(this.timeArr)
			},
			bindTimeChange(e){
				let index = e.detail.value
				this.selectedTime = this.timeArr[index]
				this.selectedSensorIndex = 0
				let dataArr
				if(index==0){ //使用全天的数据
					dataArr = this.wholeDayArr
				}else{ //使用某个时间段的数据
					dataArr = this.partArr[index-1]
				}
				let sensorSet = new Set()
				this.sensorValuesArr = []
				
				for(let data of dataArr){
					if(data.param){ //单参数
						sensorSet.add(data.param)
						if(!this.sensorValuesArr[data.param]){
							this.sensorValuesArr[data.param] = []
						}
						this.sensorValuesArr[data.param].push(data)
					}
					if(data.values){ //多参数
						sensorSet.add(0)
						if(!this.sensorValuesArr[0]){
							this.sensorValuesArr[0] = []
						}
						this.sensorValuesArr[0].push(data)
					}
				}
				this.sensorArr = Array.from(sensorSet)
				// console.log(this.sensorValuesArr)
				let firstSensorData = this.sensorValuesArr[this.sensorArr[0]]
				this.pageNum = 1
				this.totalPages = Math.ceil(firstSensorData.length/200) //计算页数
				this.tableData = firstSensorData.slice(0,200)
				// console.log(this.tableData)
			}
				
				
		},
		onLoad() {
			let that = this
			 /*#ifdef MP*/
			uni.getStorageInfo({
				success: function (res) {
					console.log('最大容量', res.limitSize);
					console.log('当前存储', res.currentSize);
					if(res.currentSize/res.limitSize>0.9){
						uni.showModal({
							content:"空间不足，是否清除缓存",
							success(res) {
								if(res.confirm){
									that.clearAll()
								}
							}
						})
					}
				}
			});
			/*#endif*/

			
			let manyParamsConfig = uni.getStorageSync("manyParamsConfig")
			if(manyParamsConfig){
				if(manyParamsConfig[0]=='COD'){
					this.manyParamsActive = ["COD","浊度(COD)"]
				}else{ //COD未连接
					this.manyParamsActive = ["--","--"]
				}
				this.manyParamsActive = [...this.manyParamsActive,...manyParamsConfig.slice(1,manyParamsConfig.length)]
				
			}
			// console.log(this.manyParamsActive)
		},
		onShow(){
			// console.log(this.unitMap)
			// console.log(this.unitMap.get("CD"))
			// console.log(uni.getStorageSync('2023-05-23'))
			
			let res = uni.getStorageInfoSync();
			let orderDataArr = []
			for(let key of res.keys){
				if(key.includes('-')){
					let arr = key.split('-')
					if(arr.length==3 && /^\d+$/.test(arr[0]) && /^\d+$/.test(arr[1]) && /^\d+$/.test(arr[2]))
					// this.dateArr.unshift(key)
					orderDataArr.push(key)
				}
			}
			this.dateArr = orderDataArr.sort().reverse()
			// console.log(this.dateArr)
			
			this.paramArr = getApp().globalData.paramArr
			this.unitArr = getApp().globalData.unitArr
			
			// this.dateArr = ['2023-05-22','2023-05-23']
		}
	}
</script>

<style>
	.param_option{
		border: 1rpx solid lightgray;text-align: center;border-radius: 10rpx;height: 100%;display: flex;justify-content: center;align-items: center;
	}
	.btn{
		color: white;font-weight: bold;margin-top: 20rpx;

	}
	.attribute{
		width: 25%;
		/* color: gray; */
	}
</style>
