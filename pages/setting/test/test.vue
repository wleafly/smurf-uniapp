<template>
	<view>
		<button @click="open">打开自定义弹窗</button>
		<waiting ref="loading_popup" title="获取设备" :content="content" showHide></waiting>
		<button @click="createExcel">App生成表格</button>
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
					setTimeout(() => {
						this.$refs.loading_popup.close()

					}, 1000)
				}, 3000)
			}
		},
		onShow() {

		}
	}
</script>

<style lang="scss">

</style>