<template>
	<view class="title">
		<u-cell-group>
			<u-cell :title="i18n('deviceName')" size="large" isLink :clickable="true" url="/pages/setting/deviceName"
				icon="/static/设备名称.png"></u-cell>
			<u-cell :title="i18n('historyData')" size="large" isLink :clickable="true" url="/pages/setting/historyData"
				icon="/static/ic_history_data.png"></u-cell>
			<u-cell :title="i18n('calibration')" size="large" isLink :clickable="true" url="/pages/setting/calibration"
				icon="/static/校准功能.png"></u-cell>
			<u-cell :title="i18n('troubleShoot')" size="large" isLink :clickable="true"
				url="/pages/setting/troubleshooting" icon="/static/故障信息.png"></u-cell>
			<u-cell :title="i18n('language')" size="large" isLink :clickable="true" url="/pages/setting/language"
				icon="/static/多语言.png"></u-cell>
			<u-cell :title="i18n('setting')" size="large" isLink :clickable="true" url="/pages/setting/set"
				icon="/static/系统设置.png"></u-cell>
			<u-cell :title="i18n('cache')" size="large" isLink :clickable="true" url="/pages/setting/download"
				icon="/static/下载.png"></u-cell> 
		</u-cell-group>


	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onReady() {

		},
		methods: {
			//为控件的属性动态绑定内容
			i18n(key) {
				return this.$i18n.messages[this.$i18n.locale][key]
			}
		}
	}
</script>

<style>
	.cell {
		border-radius: 10rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.title {
		color: $uni-bg-color;
	}
</style>