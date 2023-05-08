<template>
	<view>
		<view class="outer">
			<view class="inner">
				<view class="battery">
					<view class="power" :style="{width:num+'rpx',backgroundColor:colors}"></view>
				</view>
			</view>
			<text v-if='isElectric' class="leftText" :style="{color:colors}">{{ElectricQuantity}}%</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ElectricQuantity",
		props: {
			ElectricQuantity: {
				type: Number,
				default: 100
			},
			isElectric: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				colors: this.colorbg(),
				num: this.ElectricQuantity / 1.4
			};
		},
		methods: {
			colorbg() {
				if (this.ElectricQuantity > 20) {
					return '#00B561 '
				} else {
					return '#FF5800'
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.outer {
		display: table;
		height: 100%;
		width: 100%;
	}

	.leftText {
		margin-left: 12rpx;
		font-size: 28rpx;
		font-weight: 600;
	}

	.inner {
		display: table-cell;
		vertical-align: middle;
		text-align: center;
	}

	.battery {
		position: relative;
		display: inline-block;
		height: 20rpx;
		width: 44rpx;

		background: #B4B4B4;
		border: 1rpx solid transparent;
		border-radius: 1rpx;
	}

	.battery:before {
		content: "";
		position: absolute;
		background-color: #FFFFFF;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 5rpx;

	}

	.battery:after {
		content: "";
		position: absolute;
		top: calc(50% - 8rpx);
		right: -10rpx;
		height: 16rpx;
		width: 8rpx;
		border-radius: 0 4rpx 4rpx 0;
		background-color: #B4B4B4;
	}

	.power {
		background-color: white;
		display: block;
		position: absolute;
		top: 3rpx;
		left: 3rpx;
		bottom: 3rpx;
		right: 3rpx;
		border-radius: 5rpx;
		-webkit-transform: scaleX(0.5);
		transform: scaleX(0.5);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		transition: -webkit-transform 1s cubic-bezier(0, 0, 0.28, 0.95);
		transition: transform 1s cubic-bezier(0, 0, 0.28, 0.95);
		transition: transform 1s cubic-bezier(0, 0, 0.28, 0.95), -webkit-transform 1s cubic-bezier(0, 0, 0.28, 0.95);
	}
</style>
