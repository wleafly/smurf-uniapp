<template>
	<view>
		<button @click="open">打开自定义弹窗</button>
		<waiting ref="loading_popup" title="获取设备" :content="content" showHide></waiting>
		<view>{{padding.findIndex((it)=>it==10)}}</view>
		<view>{{padding.slice(2)}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:true,
				content: '正在获取设备,即将完成...',
				chartData: {},
				padding: [15, 10, 0, 15],

			}
		},
		methods: {
			open() {
				this.content = '正在获取设备,即将完成...'
				this.$refs.loading_popup.open()
				setTimeout(() => {
					this.content = "获取成功"
					// setTimeout(() => {
					// 	this.$refs.loading_popup.close()

					// }, 1000)
				}, 3000)
			}
		},
		onShow() {
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
					series: [{
							name: "成交量A",
							data: [35, 8, 25, 37, 4, 20]
						},
						{
							name: "成交量B",
							data: [70, 40, 65, 100, 44, 68]
						},
						{
							name: "成交量C",
							data: [100, 80, 95, 150, 112, 132]
						}
					]
				};
				this.chartData = JSON.parse(JSON.stringify(res));
			}, 500);
		}
	}
</script>

<style lang="scss">

</style>