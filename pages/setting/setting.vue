<template>
	<view class="title" style="height: 100%;display: flex;flex-direction: column;justify-content: space-between;">
		<u-cell-group>
			<u-cell :title="i18n('deviceName')" size="large" isLink :clickable="true" url="/pages/setting/deviceName"
				icon="/static/device_name.png"></u-cell>
			<u-cell :title="i18n('historyData')" size="large" isLink :clickable="true" url="/pages/setting/historyData"
				icon="/static/ic_history_data.png"></u-cell>
			<u-cell :title="i18n('calibration')" size="large" isLink :clickable="true" url="/pages/setting/calibration"
				icon="/static/calibration.png"></u-cell>
			<u-cell :title="i18n('troubleShoot')" size="large" isLink :clickable="true"
				url="/pages/setting/troubleshooting" icon="/static/fault_info.png"></u-cell>
			<u-cell :title="i18n('language')" size="large" isLink :clickable="true" url="/pages/setting/language"
				icon="/static/multi_language.png"></u-cell>
			<u-cell :title="i18n('setting')" size="large" isLink :clickable="true" url="/pages/setting/set"
				icon="/static/system_setting.png"></u-cell>
			<u-cell :title="i18n('cache')" size="large" isLink :clickable="true" url="/pages/setting/download"
				icon="/static/download.png"></u-cell> 
		</u-cell-group>
		<!-- #ifdef APP-PLUS -->
		    <view style="color: darkgray;text-align: center;margin-bottom: 10rpx;">Version 3.1.1</view>
		<!-- #endif -->

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
	page{
		height: 100%;
	}
	.cell {
		border-radius: 10rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.title {
		color: $uni-bg-color;
	}
</style>