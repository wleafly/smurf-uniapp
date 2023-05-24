<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
</style>

<script>
	import getDateTime from '@/common/getdateTime.js'; 
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(uni.getStorageSync("autoDownload")){
				getApp().globalData.autoDownload = uni.getStorageSync("autoDownload")
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			autoDownload:false,//是否自动下载实时数据
			deviceName:"", //蓝精灵的名字
			deviceArr:[], //存传感器的类型
			valueArr:[], //存传感器的数据
			
			paramArr:["多参数","电导率","电导率","pH","ORP","溶解氧","铵氮/离子类","浊度","盐度","COD","余氯","叶绿素","蓝绿藻","透明度","悬浮物","水中油","BOD"],
			unitArr:["","μS/cm","mS/cm","","mV","mg/L","mg/L","NTU","PSU","mg/L","mg/L","μg/L","Kcells/mL","mm","mg/L","mg/L",""],
			// deviceArr:[
			// 	{
			// 		address:3,
			// 		type:1,//多参数假数据
			// 		param:4
			// 	}
			// ],
			// valueArr:[ //多参数假数据
			// 	{temperature:23.4,values:[5,5,34.3,3.4,3.3,3,2,32],electric:3.764,interval:3,testTime:2},
			// 	{temperature:23.5,values:[25,15,24.3,3.3,3.1,2,3,32],electric:3.764},
			// 	{temperature:23.4,values:[5,5,24.3,3.3,3.1,2,3,32],electric:3.764},
			// 	{temperature:23.2,values:[15,35,34.3,3.4,3.3,3,2,32],electric:3.764}
			// ],
			
			// deviceArr:[
			// 	{
			// 		address:3,
			// 		type:0,//单参数
			// 		param:9 
			// 	},
			// 	{
			// 		address:6,
			// 		type:0,
			// 		param:6
			// 	},
			// 	{
			// 		address:16,
			// 		type:0,
			// 		param:4 
			// 	}
			// ],
					
			// valueArr:[
			// 	{param:9,address:3,value:34.3,temperature:23.4,mud:3.4,bod:3.3,electric:3.764,interval:3,testTime:2},//COD，多俩参数
			// 	{param:6,address:6,value:26.4,temperature:23.4,electric:3.764},//一般类型
			// 	{param:4,address:16,value:55,electric:3.764},//ORP，不带温度
			// 	{param:9,address:3,value:37.3,temperature:23.2,mud:3.4,bod:3.3,electric:3.764},//COD，多俩参数
			// 	{param:6,address:6,value:27.4,temperature:23.5,electric:3.763},//一般类型
			// 	{param:4,address:16,value:55,electric:3.763}//ORP，不带温度
			// ],
			deviceCoreData:{},//存蓝牙设备的核心数据，设备id、服务id、读写id等
			tempStr:"", //临时数据，存储不完整的蓝牙数据
			isFirstData:true,
			isNewDevice:false,
			oldParamId:null,
			addressToParamMap:[],
			firstLoading:true,//代表进入数据页是否要发f900
			
			includeParamArr:[], //历史数据页包含的参数
			normalValueArr:[],//历史数据页常规参数值数据
			manyParamValueArr:[],//历史数据页多参数值数据
			
			manyParamsDefalut:["COD","电导率","PH","ORP","溶解氧","铵氮/离子类","浊度"] ,//多参数默认配置
			manyParamCustomOptions:["电导率","PH","ORP","溶解氧","铵氮/离子类","浊度","盐度","余氯","叶绿素","蓝绿藻","透明度","悬浮物","水中油","未连接"],//多参数自定义的可选项
			manyParamCustomUnits:["mS/cm","","mV","mg/L","mg/L","NTU","PSU","mg/L","μg/L","Kcells/mL","mm","mg/L","mg/L",""]//多参数自定义的可选项对应的单位
		},
		methods:{
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
			writeValueToBle(msg,handleStr,failOperation){
				// let msg = 'F900'
				var typedArray = new Uint8Array(msg.match(/[\da-f]{2}/gi).map(function (h) {return parseInt(h, 16)}))
				uni.writeBLECharacteristicValue({
					deviceId:getApp().globalData.deviceCoreData.deviceId,
					serviceId:getApp().globalData.deviceCoreData.serviceId,
					characteristicId:getApp().globalData.deviceCoreData.writeCharacteristicId,
					value:typedArray.buffer,
					success(res) {
						console.log(msg+"数据发送成功")
						
						uni.onBLECharacteristicValueChange(res => {
							let resHex = getApp().ab2hex(res.value)
							let result = getApp().hexCharCodeToStr(resHex)
							result = String(result)
							handleStr(result)  //外部传入的方法，对接收到的字符串做处理
						
						}) 
						
						
					},
					fail(err) {
						if(failOperation){ //有方法传入再执行
							failOperation()
						}
						
						uni.showToast({icon:'none',title: msg+"发送失败"})
						console.log("数据发送失败",err)
					}
				})
			},
			writeBufferToBle(buffer,handleStr,failOperation){
				uni.writeBLECharacteristicValue({
					deviceId:getApp().globalData.deviceCoreData.deviceId,
					serviceId:getApp().globalData.deviceCoreData.serviceId,
					characteristicId:getApp().globalData.deviceCoreData.writeCharacteristicId,
					value:buffer,
					success(res) {
						console.log("buffer发送成功")
						
						uni.onBLECharacteristicValueChange(res => {
							let resHex = getApp().ab2hex(res.value)
							let result = getApp().hexCharCodeToStr(resHex)
							result = String(result)
							handleStr(result)  //外部传入的方法，对接收到的字符串做处理
						
						}) 
					},
					fail(err) {
						uni.showToast({icon:'none',title: "发送失败"})
						console.log("数据发送失败",err)
					}
				})
			},
			handleStrFromBlueTooth(result){
				console.log("收到数据:"+result)
				if(result.charAt(0)=='[' && result.search(",")!=-1){ //[6,0,6,]格式的设备类型
					result = result.slice(1,result.length-1)
					let resultArr = result.split(',')
					console.log('f900头数据',resultArr)
					//把传感器类型信息记录到全局变量deviceArr
					let device = {
						address:parseInt(resultArr[0]),
						type:parseInt(resultArr[1]),
						param:parseInt(resultArr[2]),
					}
					//地址不同时才能push新设备，同时防止重复元素
					if(getApp().globalData.deviceArr.findIndex((item)=>{return item.address==device.address})==-1){
						getApp().globalData.deviceArr.push(device)
						//在数组中添加地址和参数id的映射关系
						getApp().globalData.addressToParamMap[parseInt(resultArr[0])] = parseInt(resultArr[2])
						getApp().globalData.oldParamId = parseInt(resultArr[2]) //存下当前的参数类型，若是老设备，接收的值不带地址，可以利用这个变量
					}
				
					// let deviceStr = JSON.stringify(device)
					// for(var i =0;i< getApp().globalData.deviceArr.length;i++){
					// 	if(deviceStr != JSON.stringify(item)){
					// 		i++
					// 	}
					// }
					// if(i==getApp().globalData.deviceArr.length){  //只添加不重复的device
						
					// }
					

				}else if(result.charAt(result.length-1)!='}'){ //数据过长，对数据进行拼接
					getApp().globalData.tempStr = result //前半截数据
				}else if(result.charAt(0)!='{' && result.search("}")!=-1){ //第一位不是'{',且含有'}',说明是长数据的后半截
					if(result.endsWith("}[OK]") || result.endsWith("}[Error]")){ //f900后fc可能会出现的情况
						console.log("接收到了后半截数据带[OK]或[Error]的情况")
						result = result.split("[")[0]
					}

					getApp().globalData.tempStr = getApp().globalData.tempStr + result
					getApp().globalData.tempStr = getApp().globalData.tempStr.slice(1,getApp().globalData.tempStr.length-2).split(',') //silce是左闭右开，length-2可以移除掉最后面的,}
			
					console.log("处理后的数据:",getApp().globalData.tempStr)
					
					if(getApp().globalData.deviceArr.length>0){
						this.judgeNewOrOld()
						this.storageValue(getApp().globalData.tempStr.map(Number)) //.map(Number)可以将字符串数组转为数字类型的数组
					}
				}else{ //由于较短，可单行获取的完整数据
			
					getApp().globalData.tempStr = result.slice(1,result.length-2).split(',')
					console.log("处理后的数据：",getApp().globalData.tempStr)
					if(getApp().globalData.deviceArr.length>0){
						this.judgeNewOrOld()
						this.storageValue(getApp().globalData.tempStr.map(Number))
					}
			
				}
					
			},
			judgeNewOrOld(){  //判断是新设备还是老设备
				
				if(getApp().globalData.isFirstData){ //第一次获取到带{}的数据时执行
					console.log("判断新旧设备")
					let deviceArr = getApp().globalData.deviceArr
					console.log(deviceArr)
					// console.log()
					if(deviceArr.length>1){ //能接多个传感器，必定是新设备
						getApp().globalData.isNewDevice = true 
					}else{
						if(getApp().globalData.tempStr.length==6||getApp().globalData.tempStr.length==8){
							getApp().globalData.isNewDevice = true
						}else if(getApp().globalData.tempStr.length==5){ 
							if(deviceArr[0].param==4){ //ORP
								getApp().globalData.isNewDevice = true
							}else{
								getApp().globalData.isNewDevice = false
							}
						}else{//长度为4、7的情况
							getApp().globalData.isNewDevice = false
						}
					}
					if(getApp().globalData.isNewDevice){
						console.log('此型号是新设备')
					}else{
						console.log('此型号是老设备')
					}
					//如果开启了自动下载实时数据，则此处要添加标记
					// if(getApp().globalData.autoDownload){
					// 	this.addStorageRecord("start")
					// }
				}
			},
			storageValue(numArr){  //存数据到全局变量valueArr中，接收参数是一个数字数组
				let record = {}
				if(getApp().globalData.deviceArr[0].type!=1){  //不接多功能传感器的情况
					if(getApp().globalData.isNewDevice){ //新设备，第0项是地址
						let param = getApp().globalData.addressToParamMap[numArr[0]]
						if(param!=4){ //不为ORP
							record = {
								param:param,
								value:numArr[1],
								temperature:numArr[2],
								electric:param!=9?numArr[3]:numArr[5] 
							}
							if(param==9){
								record.mud = numArr[3]
								record.bod = numArr[4]
							}
						}else{ //ORP
							record = {
								param:param,
								value:numArr[1],
								electric:numArr[2] 
							}
						}
						
					}else{ //旧型号蓝精灵
						let param = getApp().globalData.oldParamId
						if(param!=4){ //不为ORP
							record = {
								param:param,
								value:numArr[0],
								temperature:numArr[1],
								electric:param!=9?numArr[2]:numArr[4] 
							}
							if(param==9){
								record.mud = numArr[2]
								record.bod = numArr[3]
							}
						}else{ //ORP
							record = {
								param:param,
								value:numArr[0],
								electric:numArr[1]
							}
						}
					}
				}else{ //多功能传感器
					record = {
						temperature:numArr[0],
						values:[
							numArr[1], //cod
							numArr[2], //cod浊度
							numArr[3], //电导率
							numArr[4], //PH
							numArr[5], //ORP
							numArr[6], //溶解氧
							numArr[7], //NHN
							numArr[8], //浊度
						],
						
						electric:numArr[9],
					}
				}
				
				if(getApp().globalData.isFirstData){ //第一个花括号数据要存时间，时间总是在最后两位
					record.interval = numArr[numArr.length-2]
					record.testTime = numArr[numArr.length-1]
					getApp().globalData.isFirstData = false
				}
				console.log(record)
				getApp().globalData.valueArr.push(record)
				
				//如果开启了自动下载实时数据，此处还要更新缓存中的数据
				if(getApp().globalData.autoDownload){
					record.createTime = getDateTime.dateTimeStr('y-m-d h:i:s')
					this.addStorageRecord(record)
				}
				
			},
			addStorageRecord(record){ //向当天的缓存中添加数据
				// console.log('插入本地缓存',getDateTime.dateTimeStr('y-m-d'),record)
				let arr = uni.getStorageSync(getDateTime.dateTimeStr('y-m-d')) || []
				arr.push(record)
				uni.setStorageSync(getDateTime.dateTimeStr('y-m-d'),arr)
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
