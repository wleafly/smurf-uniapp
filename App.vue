<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
</style>

<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			deviceName:"", //蓝精灵的名字
			deviceArr:[], //存传感器的类型
			valueArr:[], //存传感器的数据
			deviceCoreData:{} //存蓝牙设备的核心数据，设备id、服务id、读写id等
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
