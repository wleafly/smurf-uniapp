<template>
	<view>
		<u-modal v-model="show" :content="content">22222</u-modal>
		<u-button @click="open">
			打开模态框
		</u-button>
	</view>
</template>
	
<script>
	export default {
		data() {	
			return {
				show: false,
				content: '东临碣石，以观沧海'
			}
		},
		methods: {
			open() {
				this.show = true;
			}
		}
	}
</script>

<style lang="scss">

</style>
