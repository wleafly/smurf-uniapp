<template>
	<view>
		<view class="spinner">
			<view class="bounce1"></view>
			<view class="bounce2"></view>
			<view class="bounce3"></view>
			<text>\n{{txt}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"loading",
		props:["txt"],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.spinner {
		width: 100%;
		text-align: center;
		color: #8EBCF0;
		font-weight: bold;
	}

	.spinner>view {
		width: 30px;
		height: 30px;
		background-color: #8EBCF0;

		border-radius: 100%;
		display: inline-block;
		-webkit-animation: bouncedelay 1.4s infinite ease-in-out;
		animation: bouncedelay 1.4s infinite ease-in-out;
		/* Prevent first frame from flickering when animation starts */
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}

	.spinner .bounce1 {
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	.spinner .bounce2 {
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}

	@-webkit-keyframes bouncedelay {

		0%,
		80%,
		100% {
			-webkit-transform: scale(0.0)
		}

		40% {
			-webkit-transform: scale(1.0)
		}
	}

	@keyframes bouncedelay {

		0%,
		80%,
		100% {
			transform: scale(0.0);
			-webkit-transform: scale(0.0);
		}

		40% {
			transform: scale(1.0);
			-webkit-transform: scale(1.0);
		}
	}
</style>