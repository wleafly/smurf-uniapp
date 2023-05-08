<template>
	<!-- 历史数据页面，当前可正常显示旧的蓝精灵设备。新版蓝精灵发送F6指令后，返回的数据条数存在异常，需要进行处理，但数据图表可以正常显示 -->
	<view>		
		<view class="top_box">
			<view style="margin-left: 10rpx;">{{$t('singleParameter')}}</view>
			<view class="row" style="margin-top: 15rpx; font-size: 28rpx;">
				<text v-if="DDMM.length!=0" style="margin-left: 30rpx;" @click="change(1)">{{$t('DDMU')}}</text>
				<text v-if="pH.length!=0" style="margin-left: 30rpx;" @click="change(3)">{{$t('pH')}}</text>
				<text v-if="ORP.length!=0" style="margin-left: 30rpx;" @click="change(5)">{{$t('ORP')}}</text>
				<text v-if="oxygen.length!=0" style="margin-left: 30rpx;" @click="change(7)">{{$t('RDO')}}</text>
				<text v-if="ION.length!=0" style="margin-left: 30rpx;" @click="change(9)">{{$t('ION')}}</text>
				<text v-if="NTU.length!=0" style="margin-left: 30rpx;" @click="change(11)">{{$t('ZS')}}</text>
				<text v-if="DDMS.length!=0" style="margin-left: 30rpx;" @click="change(13)">{{$t('DDM-S')}}</text>
			</view>
			
			<view class="row" style="margin-top: 15rpx; font-size: 28rpx;">
				<text v-if="COD.length!=0" style="margin-left: 30rpx;" @click="change(15)">{{$t('COD')}}</text>
				<text v-if="CODturbidity.length!=0" style="margin-left: 30rpx;" @click="change(17)">{{$t('COD_ZS')}}</text>
				<text v-if="BOD.length!=0" style="margin-left: 30rpx;" @click="change(19)">{{$t('BOD')}}</text>
				<text v-if="CL.length!=0" style="margin-left: 30rpx;" @click="change(21)">{{$t('CL')}}</text>
				<text v-if="CHLO.length!=0" style="margin-left: 30rpx;" @click="change(23)">{{$t('CHLO')}}</text>
				<text v-if="BGA.length!=0" style="margin-left: 30rpx;" @click="change(25)">{{$t('BGA')}}</text>
			</view>
			
			<view class="row" style="margin-top: 15rpx; font-size: 28rpx;">
				<text v-if="TPS.length!=0" style="margin-left: 30rpx;" @click="change(27)">{{$t('TPS')}}</text>
				<text v-if="TSS.length!=0" style="margin-left: 30rpx;" @click="change(29)">{{$t('TSS')}}</text>
				<text v-if="OIL.length!=0" style="margin-left: 30rpx;" @click="change(31)">{{$t('OIL')}}</text>
			</view>
			
			<view style="margin-top: 30rpx; margin-left: 10rpx;">{{$t('multiParameter')}}</view>
			<view class="row" style="margin-top: 15rpx; font-size: 28rpx;">
				<text v-if="mul_temp.length!=0" style="margin-left: 30rpx;" @click="change(41)">{{$t('Temperation')}}</text>
				<text v-if="mul_DDMM.length!=0" style="margin-left: 30rpx;" @click="change(42)">{{$t('DDMU')}}</text>
				<text v-if="mul_pH.length!=0" style="margin-left: 30rpx;" @click="change(43)">{{$t('pH')}}</text>
				<text v-if="mul_ORP.length!=0" style="margin-left: 30rpx;" @click="change(44)">{{$t('ORP')}}</text>
				<text v-if="mul_oxygen.length!=0" style="margin-left: 30rpx;" @click="change(45)">{{$t('RDO')}}</text>
				<text v-if="mul_ION.length!=0" style="margin-left: 30rpx;" @click="change(46)">{{$t('ION')}}</text>
				<text v-if="mul_NTU.length!=0" style="margin-left: 30rpx;" @click="change(47)">{{$t('ZS')}}</text>
			</view>
			<view class="row" style="margin-top: 15rpx; font-size: 28rpx;">
				<text v-if="mul_DDMS.length!=0" style="margin-left: 30rpx;" @click="change(48)">{{$t('DDM-S')}}</text>
				<text v-if="mul_COD.length!=0" style="margin-left: 30rpx;" @click="change(49)">{{$t('COD')}}</text>
				<text v-if="mul_CODturbidity.length!=0" style="margin-left: 30rpx;" @click="change(50)">{{$t('COD_ZS')}}</text>
				<text v-if="mul_BOD.length!=0" style="margin-left: 30rpx;" @click="change(51)">{{$t('BOD')}}</text>
				<text v-if="mul_CL.length!=0" style="margin-left: 30rpx;" @click="change(52)">{{$t('CL')}}</text>
				<text v-if="mul_CHLO.length!=0" style="margin-left: 30rpx;" @click="change(53)">{{$t('CHLO')}}</text>
				<text v-if="mul_BGA.length!=0" style="margin-left: 30rpx;" @click="change(54)">{{$t('BGA')}}</text>
			</view>
			<view class="row" style="margin-top: 15rpx; font-size: 28rpx;">
				<text v-if="mul_TPS.length!=0" style="margin-left: 30rpx;" @click="change(55)">{{$t('TPS')}}</text>
				<text v-if="mul_TSS.length!=0" style="margin-left: 30rpx;" @click="change(56)">{{$t('TSS')}}</text>
				<text v-if="mul_OIL.length!=0" style="margin-left: 30rpx;" @click="change(57)">{{$t('OIL')}}</text>
			</view>
			<view style="height: 30rpx;"></view>
		</view>
		
		<view style="margin-top: 20rpx;">
			<text style="margin-left: 20rpx;">{{$t('total')}}：{{dataCount}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==0">{{$t('validTotal')}}：</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==1 || chartIndex==2">{{$t('validTotal')}}：{{DDMU.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==3 || chartIndex==4">{{$t('validTotal')}}：{{pH.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==5">{{$t('validTotal')}}：{{ORP.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==7 || chartIndex==8">{{$t('validTotal')}}：{{oxygen.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==9 || chartIndex==10">{{$t('validTotal')}}：{{ION.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==11 || chartIndex==12">{{$t('validTotal')}}：{{NTU.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==13 || chartIndex==14">{{$t('validTotal')}}：{{DDMS.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==15 || chartIndex==16">{{$t('validTotal')}}：{{COD.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==17 || chartIndex==18">{{$t('validTotal')}}：{{CODturbidity.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==19 || chartIndex==20">{{$t('validTotal')}}：{{BOD.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==21 || chartIndex==22">{{$t('validTotal')}}：{{CL.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==23 || chartIndex==24">{{$t('validTotal')}}：{{CHLO.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==25 || chartIndex==26">{{$t('validTotal')}}：{{BGA.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==27 || chartIndex==28">{{$t('validTotal')}}：{{TPS.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==29 || chartIndex==30">{{$t('validTotal')}}：{{TSS.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==31 || chartIndex==32">{{$t('validTotal')}}：{{OIL.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==41">{{$t('validTotal')}}：{{mul_temp.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==42">{{$t('validTotal')}}：{{mul_DDMU.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==43">{{$t('validTotal')}}：{{mul_pH.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==44">{{$t('validTotal')}}：{{mul_ORP.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==45">{{$t('validTotal')}}：{{mul_oxygen.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==46">{{$t('validTotal')}}：{{mul_ION.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==47">{{$t('validTotal')}}：{{mul_NTU.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==48">{{$t('validTotal')}}：{{mul_DDMS.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==49">{{$t('validTotal')}}：{{mul_COD.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==50">{{$t('validTotal')}}：{{mul_CODturbidity.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==51">{{$t('validTotal')}}：{{mul_BOD.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==52">{{$t('validTotal')}}：{{mul_CL.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==53">{{$t('validTotal')}}：{{mul_CHLO.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==54">{{$t('validTotal')}}：{{mul_BGA.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==55">{{$t('validTotal')}}：{{mul_TPS.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==56">{{$t('validTotal')}}：{{mul_TSS.length}}</text>
			<text style="margin-left: 100rpx;" v-show="chartIndex==57">{{$t('validTotal')}}：{{mul_OIL.length}}</text>
		</view>
		
		<view v-show="chartIndex==0" style="height: 300rpx;width: 100%; background-color: aliceblue;">
			<view style="margin-top: 20rpx; margin-left: 20rpx;">{{$t('realTime')}}</view>
		</view>
		
		<view v-show="chartIndex==1" class="charts-box" style="margin-top: 50rpx;">
		    <qiun-data-charts 
		      type="line"
		      :opts="opts1"
		      :chartData="chartData1"
		      :canvas2d="true"
		      canvasId="AezIfAaDznIafvahvNVxvnQlFRepvQPN"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==2" class="charts-box" style="margin-top: 50rpx;">
		    <qiun-data-charts 
		      type="line"
		      :opts="opts2"
		      :chartData="chartData2"
		      :canvas2d="true"
		      canvasId="ZCLKLjXMdVfOMYAXzNlwjdVSefncHvUn"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==3" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(3)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(4)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts3"
		      :chartData="chartData3"
		      :canvas2d="true"
		      canvasId="eTFOHjzxgqFSaixOLzQyGLFcEeDLlEtE"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==4" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(3)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(4)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts4"
		      :chartData="chartData4"
		      :canvas2d="true"
		      canvasId="yqesGyDgaktsEITOxrLYIaUnwWxffXxZ"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==5" class="charts-box" style="margin-top: 50rpx;">
		    <qiun-data-charts 
		      type="line"
		      :opts="opts5"
		      :chartData="chartData5"
		      :canvas2d="true"
		      canvasId="GOFFXATbAiOjTlACvFYSNgnXgAcnRAiC"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==7" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(7)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(8)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts7"
		      :chartData="chartData7"
		      :canvas2d="true"
		      canvasId="wyUqCYdixIZqzGrfHSRvcPwvBuCAHjVT"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==8" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(7)">{{$t('realTime')}}</text>
			<text style="margin-left: 250rpx;" @click="change(8)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts8"
		      :chartData="chartData8"
		      :canvas2d="true"
		      canvasId="nSITWUWYTlFuFFHPgjkFTUCPLPZVricO"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==9" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(9)">{{$t('realTime')}}</text>
			<text style="margin-left: 250rpx;" @click="change(10)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts9"
		      :chartData="chartData9"
		      :canvas2d="true"
		      canvasId="BTAnvGiDNhUEGUbKyWicEOweaRbALLSt"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==10" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(9)">{{$t('realTime')}}</text>
			<text style="margin-left: 250rpx;" @click="change(10)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts10"
		      :chartData="chartData10"
		      :canvas2d="true"
		      canvasId="OdsqajFdZMoeWqOKmYSgZRIQctLERTxn"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==11" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(11)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(12)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts11"
		      :chartData="chartData11"
		      :canvas2d="true"
		      canvasId="AzUJPWIRoXBPXHCcMECgUESnHYnTeklx"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==12" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(11)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(12)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts12"
		      :chartData="chartData12"
		      :canvas2d="true"
		      canvasId="oCOXvqmyreEudPFFIHdUrDKFvgpCESQv"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==13" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(13)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(14)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts13"
		      :chartData="chartData13"
		      :canvas2d="true"
		      canvasId="WeroChVnilKuCCKwBIhTXSBUirzGdkFm"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==14" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(13)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(14)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts14"
		      :chartData="chartData14"
		      :canvas2d="true"
		      canvasId="iMVuBtvxAXvJrZulJpLNcOLcOylGYheS"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==15" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(15)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(16)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts15"
		      :chartData="chartData15"
		      :canvas2d="true"
		      canvasId="eoGYPyKdqrSiStFUzAECzNjMeNDnhyhH"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==16" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(15)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(16)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts16"
		      :chartData="chartData16"
		      :canvas2d="true"
		      canvasId="AhtMwjIBoRMXwSlDLmkGStDszIxjIlPE"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==17" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(17)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(18)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts17"
		      :chartData="chartData17"
		      :canvas2d="true"
		      canvasId="HUXqRYUuQWUQyUinHdzkkGmYhhfgovnU"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==18" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(17)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(18)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts18"
		      :chartData="chartData18"
		      :canvas2d="true"
		      canvasId="NpNjFVQDcJGINnBODuciVvBrUZJTwHvh"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==19" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(19)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(20)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts19"
		      :chartData="chartData19"
		      :canvas2d="true"
		      canvasId="EHVLpFPkUNAFmuYNPlYJfvkYhpzMsTZA"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==20" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(19)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(20)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts20"
		      :chartData="chartData20"
		      :canvas2d="true"
		      canvasId="FblVtQNvztLeQGFxzwPSIUWidfVXybiB"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==21" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(21)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(22)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts21"
		      :chartData="chartData21"
		      :canvas2d="true"
		      canvasId="vVcIMWNDfHRZuGuIbUILeYtiOkREXjDd"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==22" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(21)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(22)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts22"
		      :chartData="chartData22"
		      :canvas2d="true"
		      canvasId="BQGPXecfTzkkJzVMeIjfHAgzBdQLgcQG"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==23" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(23)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(24)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts23"
		      :chartData="chartData23"
		      :canvas2d="true"
		      canvasId="JmCPbKCVJuvTKZbKGhqPkOAveUltYNNf"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==24" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(23)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(24)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts24"
		      :chartData="chartData24"
		      :canvas2d="true"
		      canvasId="KfxOGJupkJdPsOmixosAHsDCClHADcUN"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==25" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(25)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(26)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts25"
		      :chartData="chartData25"
		      :canvas2d="true"
		      canvasId="jyJOpkKoutwNbfypZTJNiptJkufWVBhx"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==26" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(25)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(26)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts26"
		      :chartData="chartData26"
		      :canvas2d="true"
		      canvasId="lEZSmzXuKJsGppOgnuaxySECyMnYEQvS"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==27" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(27)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(28)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts27"
		      :chartData="chartData27"
		      :canvas2d="true"
		      canvasId="XYSmcIXQnxnYrhQLVxiiTRjodIooHomM"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==28" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(27)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(28)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts28"
		      :chartData="chartData28"
		      :canvas2d="true"
		      canvasId="PhUeOIvRWbASJYeDHLxWZgHrBjRTuPLZ"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==29" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(29)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(30)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts29"
		      :chartData="chartData29"
		      :canvas2d="true"
		      canvasId="uSTjzNKKwsGaYbsvdLKsuIjAxhDpdFvS"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==30" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(29)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(30)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts30"
		      :chartData="chartData30"
		      :canvas2d="true"
		      canvasId="CsftIFCQMyxsVmjUXroDLbTzrkeZQYzH"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==31" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(31)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(32)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts31"
		      :chartData="chartData31"
		      :canvas2d="true"
		      canvasId="FDPnvtfMtAmVbNzVzwryTuWqHcOitGHa"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==32" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
			<text style="margin-left: 50rpx;" @click="change(31)">{{$t('realTime')}}</text>
			<text style="margin-left: 300rpx;" @click="change(32)">{{$t('Temperation')}}</text>
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts32"
		      :chartData="chartData32"
		      :canvas2d="true"
		      canvasId="eEuvBnXxxKpjJtkqUrMyNxtbWzltdQwI"
		      :ontouch="true"
		    />
		</view>
		
		<!-- 多参数部分 -->
		<view v-show="chartIndex==41" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts41"
		      :chartData="chartData41"
		      :canvas2d="true"
		      canvasId="TknmmphOGfWfRUAeHsLTuUjQJdrGPTYd"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==42" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts42"
		      :chartData="chartData42"
		      :canvas2d="true"
		      canvasId="KMsdoJejRzDHiPLEaLyBzbvXttTPjgJi"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==43" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts43"
		      :chartData="chartData43"
		      :canvas2d="true"
		      canvasId="OprDgegJtvcKuXqAfHAbqVefsXwDlSpm"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==44" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts44"
		      :chartData="chartData44"
		      :canvas2d="true"
		      canvasId="tpCkaKcPHijCNpQcIUtuxVMxGfQLylEf"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==45" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts45"
		      :chartData="chartData45"
		      :canvas2d="true"
		      canvasId="bNknlkipWIZQkpfDdnKNhdOQOwoAGuRX"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==46" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts46"
		      :chartData="chartData46"
		      :canvas2d="true"
		      canvasId="DnOiFvmAraWjwQsRKICHTVPXIkhthCLI"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==47" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts47"
		      :chartData="chartData47"
		      :canvas2d="true"
		      canvasId="TqFzlVVdAQWKTbunHYCMBAKdkFovkviM"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==48" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts48"
		      :chartData="chartData48"
		      :canvas2d="true"
		      canvasId="MYxRgEoUCkOIsIQqtfoXsKEHFuGDByAC"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==49" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts49"
		      :chartData="chartData49"
		      :canvas2d="true"
		      canvasId="vhANNRwjRZPToZLlZIZhMjzuTvjlgpPY"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==50" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts50"
		      :chartData="chartData50"
		      :canvas2d="true"
		      canvasId="vUDCdNmgmDARpTIOyaosMhfemYwWbIXP"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==51" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts51"
		      :chartData="chartData51"
		      :canvas2d="true"
		      canvasId="JptSgiqCBoSHePYEztslKeZMviWJegDx"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==52" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts52"
		      :chartData="chartData52"
		      :canvas2d="true"
		      canvasId="nBiEckMIyoiLHRKhbRaUqyfoZgkLoYQg"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==53" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts53"
		      :chartData="chartData53"
		      :canvas2d="true"
		      canvasId="vybABFdyCUuPvAlmqnMQTNpiURHPDEGg"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==54" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts54"
		      :chartData="chartData54"
		      :canvas2d="true"
		      canvasId="IRdEiFvQEJXBLSWurylCbOsjYpyFwjwD"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==55" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts55"
		      :chartData="chartData55"
		      :canvas2d="true"
		      canvasId="CLoWtvirJtqQwPRRPMQJFhKFEhglqnEX"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==56" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts56"
		      :chartData="chartData56"
		      :canvas2d="true"
		      canvasId="qjupHYuTzWmhGylDKGRugiIlieBLzPGZ"
		      :ontouch="true"
		    />
		</view>
		
		<view v-show="chartIndex==57" class="charts-box" style="margin-top: 50rpx;">
			<view style="height: 20rpx;"></view>
		    <qiun-data-charts 
		      type="line"
		      :opts="opts57"
		      :chartData="chartData57"
		      :canvas2d="true"
		      canvasId="TvXpYTcoUunJYNAtwZFOsfzcwTZuGiDF"
		      :ontouch="true"
		    />
		</view>

		
		<view style="height: 30rpx;"></view>
		
		<view class="row">
			<button style="width: 350rpx;" @click="clearHistory">{{$t('historyDataDelete')}}</button>
			<button style="width: 350rpx;" @click="downLoad">{{$t('download')}}</button>
		</view>
		
		<!-- <button class="button" @click="xiugai">获取历史数据</button> -->
		
		<view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" :cancelText="i18n('cancel')" 
				:content="i18n('historyData_dialog1')+dataCount+i18n('historyData_dialog2')+dataCount/50+i18n('historyData_dialog3')"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>

			<!-- 提示窗 -->
			<!-- <uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" 
				:content="'存储的历史数据约有'+dataCount+'条,预计读取时间'+dataCount/50+'秒，是否现在读取？'"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup> -->
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId:'',
				serviceId:'',
				notifyCharacteristicId:'',
				writeCharacteristicId:'',
				messageHex:'',
				message:'',
				str:'',
				chartIndex:0,
				dataCount:0,
				type: 'center',
				msgType: 'success',
				
				temp:[], //温度

				BOD:[], //BOD
				BOD_temp:[],
				
				COD:[], //COD
				COD_temp:[],
				
				CODturbidity:[], //COD内置浊度
				
				DDMS:[], // 电导率/盐度
				DDMS_temp:[],
				
				pH:[], //pH
				pH_temp:[],
				 
				ORP:[], //ORP氧化还原电位
				
				oxygen:[], //溶解氧
				oxygen_temp:[],
				
				ION:[], //铵氮/离子类
				ION_temp:[],
				
				NTU:[], //浊度
				NTU_temp:[],
				
				DDMU:[], //电导率
				DDMU_temp:[],
				
				DDMM:[], //电导率
				DDMM_temp:[],
				
				CL:[], //余率
				CL_temp:[],
				
				CHLO:[], //叶绿素
				CHLO_temp:[],
				
				BGA:[], //蓝绿藻
				BGA_temp:[],
				
				TPS:[], //透明度
				TPS_temp:[],
				
				TSS:[], //悬浮物
				TSS_temp:[],
				
				OIL:[], //水中油
				OIL_temp:[],
				
				mul_temp:[],
				mul_COD:[],
				mul_CODturbidity:[],
				mul_DDMM:[],
				mul_DDMU:[],
				mul_pH:[],
				mul_ORP:[],
				mul_oxygen:[],
				mul_ION:[],
				mul_NTU:[],
				mul_DDMS:[],
				mul_BOD:[],
				mul_CL:[],
				mul_CHLO:[],
				mul_BGA:[],
				mul_TPS:[],
				mul_TSS:[],
				mul_OIL:[],
				
				chartData1: {},
				categories1:[], //x轴
				flag1:false,
				chartData2: {},
				categories2:[], //x轴
				flag2:false,
				chartData3: {},
				categories3:[], //x轴
				flag3:false,
				chartData4: {},
				categories4:[], //x轴
				flag4:false,
				chartData5: {},
				categories5:[], //x轴
				flag5:false,
				chartData6: {},
				categories6:[], //x轴
				flag6:false,
				chartData7: {},
				categories7:[], //x轴
				flag7:false,
				chartData8: {},
				categories8:[], //x轴
				flag8:false,
				chartData9: {},
				categories9:[], //x轴
				flag9:false,
				chartData10: {},
				categories10:[], //x轴
				flag10:false,
				chartData11: {},
				categories11:[], //x轴
				flag11:false,
				chartData12: {},
				categories12:[], //x轴
				flag12:false,
				chartData13: {},
				categories13:[], //x轴
				flag13:false,
				chartData14: {},
				categories14:[], //x轴
				flag14:false,
				chartData15: {},
				categories15:[], //x轴
				flag15:false,
				chartData16: {},
				categories16:[], //x轴
				flag16:false,
				chartData17: {},
				categories17:[], //x轴
				flag17:false,
				chartData18: {},
				categories18:[], //x轴
				flag18:false,
				chartData19: {},
				categories19:[], //x轴
				flag19:false,
				chartData20: {},
				categories20:[], //x轴
				flag20:false,
				chartData21: {},
				categories21:[], //x轴
				flag21:false,
				chartData22: {},
				categories22:[], //x轴
				flag22:false,
				chartData23: {},
				categories23:[], //x轴
				flag23:false,
				chartData24: {},
				categories24:[], //x轴
				flag24:false,
				chartData25: {},
				categories25:[], //x轴
				flag25:false,
				chartData26: {},
				categories26:[], //x轴
				flag26:false,
				chartData27: {},
				categories27:[], //x轴
				flag27:false,
				chartData28: {},
				categories28:[], //x轴
				flag28:false,
				chartData29: {},
				categories29:[], //x轴
				flag29:false,
				chartData30: {},
				categories30:[], //x轴
				flag30:false,
				chartData31: {},
				categories31:[], //x轴
				flag31:false,
				chartData41: {},
				categories41:[], //x轴
				flag41:false,
				chartData42: {},
				categories42:[], //x轴
				flag42:false,
				chartData43: {},
				categories43:[], //x轴
				flag43:false,
				chartData44: {},
				categories44:[], //x轴
				flag44:false,
				chartData45: {},
				categories45:[], //x轴
				flag45:false,
				chartData46: {},
				categories46:[], //x轴
				flag46:false,
				chartData47: {},
				categories47:[], //x轴
				flag47:false,
				chartData48: {},
				categories48:[], //x轴
				flag48:false,
				chartData49: {},
				categories49:[], //x轴
				flag49:false,
				chartData50: {},
				categories50:[], //x轴
				flag50:false,
				chartData51: {},
				categories51:[], //x轴
				flag51:false,
				chartData52: {},
				categories52:[], //x轴
				flag52:false,
				chartData53: {},
				categories53:[], //x轴
				flag53:false,
				chartData54: {},
				categories54:[], //x轴
				flag54:false,
				
				
				series1:[{
					name: "电导率",
					data: []
				}],
				series2:[{
					name: "电导率内置温度",
					data: []
				}],
				series3:[{
					name: "pH",
					data: []
				}],
				series4:[{
					name: "pH内置温度",
					data: []
				}],
				series5:[{
					name: "ORP",
					data: []
				}],
				// series6:[{
				// 	name: "",
				// 	data: []
				// }],
				series7:[{
					name: "溶解氧",
					data: []
				}],
				series8:[{
					name: "溶解氧内置温度",
					data: []
				}],
				series9:[{
					name: "铵氮/离子类",
					data: []
				}],
				series10:[{
					name: "铵氮/离子类温度",
					data: []
				}],
				series11:[{
					name: "浊度",
					data: []
				}],
				series12:[{
					name: "浊度内置温度",
					data: []
				}],
				series13:[{
					name: "盐度",
					data: []
				}],
				series14:[{
					name: "盐度内置温度",
					data: []
				}],
				series15:[{
					name: "COD",
					data: []
				}],
				series16:[{
					name: "COD内置温度",
					data: []
				}],
				series17:[{
					name: "浊度(COD)",
					data: []
				}],
				series18:[{
					name: "浊度(COD)内置温度",
					data: []
				}],
				series19:[{
					name: "BOD",
					data: []
				}],
				series20:[{
					name: "BOD内置温度",
					data: []
				}],
				series21:[{
					name: "余氯",
					data: []
				}],
				series22:[{
					name: "余氯内置温度",
					data: []
				}],
				series23:[{
					name: "叶绿素",
					data: []
				}],
				series24:[{
					name: "叶绿素内置温度",
					data: []
				}],
				series25:[{
					name: "蓝绿藻",
					data: []
				}],
				series26:[{
					name: "蓝绿藻内置温度",
					data: []
				}],
				series27:[{
					name: "透明度",
					data: []
				}],
				series28:[{
					name: "透明度内置温度",
					data: []
				}],
				series29:[{
					name: "悬浮物",
					data: []
				}],
				series30:[{
					name: "悬浮物内置温度",
					data: []
				}],
				series31:[{
					name: "水中油",
					data: []
				}],
				series32:[{
					name: "水中油内置温度",
					data: []
				}],
				series41:[{
					name: "温度",
					data: []
				}],
				series42:[{
					name: "电导率",
					data: []
				}],
				series43:[{
					name: "pH",
					data: []
				}],
				series44:[{
					name: "ORP",
					data: []
				}],
				series45:[{
					name: "溶解氧",
					data: []
				}],
				series46:[{
					name: "铵氮/离子类",
					data: []
				}],
				series47:[{
					name: "浊度",
					data: []
				}],
				series48:[{
					name: "盐度",
					data: []
				}],
				series49:[{
					name: "COD",
					data: []
				}],
				series50:[{
					name: "浊度(COD)",
					data: []
				}],
				series51:[{
					name: "BOD",
					data: []
				}],
				series52:[{
					name: "余氯",
					data: []
				}],
				series53:[{
					name: "叶绿素",
					data: []
				}],
				series54:[{
					name: "蓝绿藻",
					data: []
				}],
				
				opts1: { //电导率
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "电导率",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts2: { //电导率内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts3: { //pH
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,

				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "pH",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts4: { //pH内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts5: { //ORP
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "ORP",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts7: { //溶解氧
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "溶解氧",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts8: { //溶解氧内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts9: { //铵氮/离子类
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "铵氮/离子类",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts10: { //铵氮/离子类内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts11: { //浊度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "浊度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts12: { //浊度内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts13: { //盐度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "盐度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}],
						max:30,
						min:0,
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			
				opts14: { //盐度内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts15: { //COD
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "COD",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts16: { //COD内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts17: { //浊度(COD)
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "浊度(COD)",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts18: { //浊度(COD)内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts19: { //BOD
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "BOD",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts20: { //BOD内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts21: { //余氯
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "余氯",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts22: { //余氯内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts23: { //叶绿素
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "叶绿素",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts24: { //叶绿素内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts25: { //蓝绿藻
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "蓝绿藻",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts26: { //蓝绿藻内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts27: { //透明度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "透明度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts28: { //透明度内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts29: { //悬浮物
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "悬浮物",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts30: { //悬浮物内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts31: { //水中油
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "水中油",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts32: { //水中油内置温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts41: { //温度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "温度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts42: { //电导率
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "电导率",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts43: { //pH
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "pH",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts44: { //ORP
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "ORP",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts45: { //溶解氧
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "溶解氧",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts46: { //铵氮/离子类
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "铵氮/离子类",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts47: { //浊度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "浊度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts48: { //盐度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "盐度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts49: { //COD
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "COD",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts50: { //浊度(COD)
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "浊度(COD)",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts51: { //BOD
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "BOD",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts52: { //余氯
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "余氯",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts53: { //叶绿素
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "叶绿素",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts54: { //蓝绿藻
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "蓝绿藻",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts55: { //透明度
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "透明度",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts56: { //悬浮物
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "悬浮物",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
				
				opts57: { //水中油
				    color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				    padding: [15,10,10,15],
				    enableScroll: true,
					update:true,
				    legend: {show:false},
					animation:false,
					duration:0,
					scrollPosition:'current',
				    xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 10,
				    },
				    yAxis: {
				        gridType: "dash",
				        dashLength: 2,
						showTitle:true,
						data: [{
							title: "水中油",//纵轴标题
							titleOffsetY: -8, //标题纵向偏移距离，负数为向上偏移，正数向下偏移
							fontColor:"#999",
							titleFontColor:"#999",
						}]
				    },
				    extra: {
				        line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
				        }
				    }
				},
			}
		},
		onShow() {
			this.deviceId=getApp().globalData.deviceCoreData.deviceId
			this.serviceId=getApp().globalData.deviceCoreData.serviceId
			this.notifyCharacteristicId=getApp().globalData.deviceCoreData.notifyCharacteristicId
			this.writeCharacteristicId=getApp().globalData.deviceCoreData.writeCharacteristicId
			setTimeout(() => {
				let msg = 'F6'
				this.send(msg)
			}, 500);
			
			setTimeout(() => {
				if(this.dataCount!=0){
					this.dialogToggle('success')
				}
			}, 4000);
			
		},
		methods: {	
			//为控件的属性动态绑定内容
			i18n(key) {
			    return this.$i18n.messages[this.$i18n.locale][key]
			},
			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				let msg = 'FB'
				this.send(msg)
			},
			dialogClose() {
				console.log('点击关闭')
			},
			// 启用 notify 功能
			notifyBLECharacteristicValueChange(){
				let that = this
				uni.notifyBLECharacteristicValueChange({
				  state: true, // 启用 notify 功能
				  deviceId:this.deviceId,
				  serviceId:this.serviceId,
				  characteristicId:this.notifyCharacteristicId,
				  success:(res)=> {
					console.log("启动notify功能成功")
				  },
				  fail:(res)=> {
					console.log('fail', res.errMsg)
				  }
				})
			},
			//通过蓝牙向设备发送数据
			send(msg){
				var typedArray = new Uint8Array(msg.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16)
					}))
				var buffer = typedArray.buffer
				let that =this

				uni.writeBLECharacteristicValue({
					deviceId:this.deviceId,
					serviceId:this.serviceId,
					characteristicId:this.writeCharacteristicId,
					value:buffer,
					success(res) {
						uni.showToast({icon:'none',title: "数据发送成功"})
						// console.log(res)
						console.log("数据发送成功")
						that.listenValueChange()
					},
					fail(err) {
						console.error(err)
						uni.showToast({icon:'none',title: "数据发送失败"})
						console.log("数据发送失败")
					}
				})
			},
			//监听数据变化
			listenValueChange() {
				let res2 = {
					categories: this.categories2,
					series: this.series2,
				};
				let that = this
			    uni.onBLECharacteristicValueChange(res => {
			        let resHex = this.ab2hex(res.value)
			        this.messageHex.value = resHex
					console.log(resHex)
					if(resHex.length<=10 && resHex.slice(0,2) == '5b' && resHex.slice(resHex.length-2,resHex.length) == '5d'){	//判断历史数据条数的格式
						resHex = resHex.slice(2,resHex.length-2)
						let count = parseInt(resHex,16)
						this.dataCount = count
						console.log(this.dataCount)
					}
			        let result = this.hexCharCodeToStr(resHex)
					console.log(result)
					result = String(result)
					
					
					if(result.charAt(0)=='[' && result.charAt(result.length-1)!=']'){ //[6,0,6, 格式
						this.str = ''
						this.str = this.str + result
					}else if(result.charAt(0)!='[' && result.charAt(result.length-1)==']'){ // ,6,1] 格式
						this.str = this.str + result
						this.str = this.str.slice(1,this.str.length-1)
						this.str = this.str.split(',')
						console.log(this.str)
					}else{  //[1,1,1] 格式
						this.str = result
						this.str = this.str.slice(1,this.str.length-1)
						this.str = this.str.split(',')
						console.log(this.str)
					}
					
					if(this.str[0] == '1'){ //多参数历史数据
						this.mul_temp.push(this.str[2])
						this.mul_COD.push(this.str[3])
						this.mul_CODturbidity.push(this.str[4])
						this.mul_DDMU.push(this.str[5])
						this.mul_pH.push(this.str[6])
						this.mul_ORP.push(this.str[7])
						this.mul_oxygen.push(this.str[8])
						this.mul_ION.push(this.str[9])
						this.mul_NTU.push(this.str[10])
					}else if(this.str[0] == '0' && this.str[1] == '1'){
						this.DDMU.push(this.str[2])
						this.DDMU_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '3'){
						this.pH.push(this.str[2])
						this.pH_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '4'){
						this.ORP.push(this.str[2])
					}else if(this.str[0] == '0' && this.str[1] == '5'){
						this.oxygen.push(this.str[2])
						this.oxygen_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '6'){
						this.ION.push(this.str[2])
						this.ION_temp.push(this.str[3])
					}else if (this.str[0] == '0' && this.str[1] == '7'){
						this.NTU.push(this.str[2])
						this.NTU_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '8'){
						this.DDMS.push(this.str[2])
						this.DDMS_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '9'){
						this.COD.push(this.str[2])
						this.COD_temp.push(this.str[3])
						this.NTU.push(this.str[4])
						this.BOD.push(this.str[5])
					}else if(this.str[0] == '0' && this.str[1] == '10'){
						this.CL.push(this.str[2])
						this.CL_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '11'){
						this.CHLO.push(this.str[2])
						this.CHLO_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '12'){
						this.BGA.push(this.str[2])
						this.BGA_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '13'){
						this.TPS.push(this.str[2])
						this.TPS_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '14'){
						this.TSS.push(this.str[2])
						this.TSS_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '15'){
						this.OIL.push(this.str[2])
						this.OIL_temp.push(this.str[3])
					}else if(this.str[0] == '0' && this.str[1] == '16'){
						this.BOD.push(this.str[2])
						this.BOD_temp.push(this.str[3])
					}
					
			    })
			},
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
			
			xiugai(){ 
				let msg = 'FB'
				this.send(msg)
			},
			// clearHistory(){
			// 	let msg = 'FD'
			// 	this.send(msg)
			// },
			downLoad(){
				const data = '123123';
				const fs = uni.getFileSystemManager()
				// 使用uni的文件系统API创建一个文件，并将data中的内容写入该文件
				fs.writeFile({
				  filePath: `${uni.env.USER_DATA_PATH}/hello.doc`, // 保存文件的路径
				  data: data, // 将数组中的内容转换成字符串，并按行分隔
				  encoding: 'utf8', // 指定保存文件的编码格式为utf8
				  success: function () {
				    console.log('保存成功');
					uni.openDocument({  
                        showMenu: true,
                        filePath: uni.env.USER_DATA_PATH+'/hello.doc',
						fileType: 'doc',
                        success: function(res) {
                           console.log('打开文档成功');
                        }
                    });
				  },
				  fail: function (error) {
				    console.log('保存失败：' + error);
				  }
				});
			},

			change(index){
				this.chartIndex = index
				if(this.chartIndex == 1 && this.flag1 == false){ //电导率DDMU
					this.flag1 = true
					this.series1[0].data = this.DDMU
					for(var i = 1;i<=this.DDMU.length;i++){
						this.categories1.push(i)
					}
					let res1 = {
					    categories: this.categories1,
					    series: this.series1
					};
					this.chartData1 = JSON.parse(JSON.stringify(res1))
				}else if(this.chartIndex == 2 && this.flag2 == false){ //电导率DDMU内置温度
					this.flag2 = true
					this.series2[0].data = this.DDMU_temp
					for(var i = 1;i<=this.DDMU_temp.length;i++){
						this.categories2.push(i)
					}
					let res2 = {
					    categories: this.categories2,
					    series: this.series2
					};
					this.chartData2 = JSON.parse(JSON.stringify(res2))
				}else if(this.chartIndex == 3 && this.flag3 == false){ //pH
					this.flag3 = true
					this.series3[0].data = this.pH
					for(var i = 1;i<=this.pH.length;i++){
						this.categories3.push(i)
					}
					let res3 = {
					    categories: this.categories3,
					    series: this.series3
					};
					this.chartData3 = JSON.parse(JSON.stringify(res3))
				}else if(this.chartIndex == 4 && this.flag4 == false){ //pH内置温度
					this.flag4 = true
					this.series4[0].data = this.pH_temp
					for(var i = 1;i<=this.pH_temp.length;i++){
						this.categories4.push(i)
					}
					let res4 = {
					    categories: this.categories4,
					    series: this.series4
					};
					this.chartData4 = JSON.parse(JSON.stringify(res4))
				}else if(this.chartIndex == 5 && this.flag5 == false){ //ORP
					this.flag5 = true
					this.series5[0].data = this.ORP
					for(var i = 1;i<=this.ORP.length;i++){
						this.categories5.push(i)
					}
					let res5 = {
					    categories: this.categories5,
					    series: this.series5
					};
					this.chartData5 = JSON.parse(JSON.stringify(res5))
				}else if(this.chartIndex == 7 && this.flag7 == false){ //溶解氧
					this.flag7 = true
					this.series7[0].data = this.oxygen
					for(var i = 1;i<=this.oxygen.length;i++){
						this.categories3.push(i)
					}
					let res3 = {
					    categories: this.categories7,
					    series: this.series7
					};
					this.chartData7 = JSON.parse(JSON.stringify(res7))
				}else if(this.chartIndex == 8 && this.flag8 == false){ //溶解氧内置温度
					this.flag8 = true
					this.series8[0].data = this.oxygen_temp
					for(var i = 1;i<=this.oxygen_temp.length;i++){
						this.categories8.push(i)
					}
					let res8 = {
					    categories: this.categories8,
					    series: this.series8
					};
					this.chartData8 = JSON.parse(JSON.stringify(res8))
				}else if(this.chartIndex == 9 && this.flag9 == false){ //铵氮/离子类
					this.flag9 = true
					this.series9[0].data = this.ION
					for(var i = 1;i<=this.ION.length;i++){
						this.categories9.push(i)
					}
					let res9 = {
					    categories: this.categories9,
					    series: this.series9
					};
					this.chartData9 = JSON.parse(JSON.stringify(res9))
				}else if(this.chartIndex == 10 && this.flag10 == false){ //铵氮/离子类内置温度
					this.flag10 = true
					this.series10[0].data = this.ION_temp
					for(var i = 1;i<=this.ION_temp.length;i++){
						this.categories10.push(i)
					}
					let res10 = {
					    categories: this.categories10,
					    series: this.series10
					};
					this.chartData10 = JSON.parse(JSON.stringify(res10))
				}else if(this.chartIndex == 11 && this.flag11 == false){ //浊度
					this.flag11 = true
					this.series11[0].data = this.NTU
					for(var i = 1;i<=this.NTU.length;i++){
						this.categories11.push(i)
					}
					let res11 = {
					    categories: this.categories11,
					    series: this.series11
					};
					this.chartData11 = JSON.parse(JSON.stringify(res11))
				}else if(this.chartIndex == 12 && this.flag12 == false){ //浊度内置温度
					this.flag12 = true
					this.series12[0].data = this.NTU_temp
					for(var i = 1;i<=this.NTU_temp.length;i++){
						this.categories12.push(i)
					}
					let res12 = {
					    categories: this.categories12,
					    series: this.series12
					};
					this.chartData12 = JSON.parse(JSON.stringify(res12))
				}else if(this.chartIndex == 13 && this.flag13 == false){ //盐度
					this.flag13 = true
					this.series13[0].data = this.DDMS
					for(var i = 1;i<=this.DDMS.length;i++){
						this.categories13.push(i)
					}
					let res13 = {
					    categories: this.categories13,
					    series: this.series13
					};
					this.chartData13 = JSON.parse(JSON.stringify(res13))
				}else if(this.chartIndex == 14 && this.flag14 == false){ //盐度内置温度
					this.flag14 = true
					this.series14[0].data = this.DDMS_temp
					for(var i = 1;i<=this.DDMS_temp.length;i++){
						this.categories14.push(i)
					}
					let res14 = {
					    categories: this.categories14,
					    series: this.series14
					};
					this.chartData14 = JSON.parse(JSON.stringify(res14))
				}else if(this.chartIndex == 15 && this.flag15 == false){ //COD
					this.flag15 = true
					this.series15[0].data = this.COD
					for(var i = 1;i<=this.COD.length;i++){
						this.categories15.push(i)
					}
					let res15 = {
					    categories: this.categories15,
					    series: this.series15
					};
					this.chartData15 = JSON.parse(JSON.stringify(res15))
				}else if(this.chartIndex == 16 && this.flag16 == false){ //COD内置温度
					this.flag16 = true
					this.series16[0].data = this.COD_temp
					for(var i = 1;i<=this.COD_temp.length;i++){
						this.categories16.push(i)
					}
					let res16 = {
					    categories: this.categories16,
					    series: this.series16
					};
					this.chartData16 = JSON.parse(JSON.stringify(res16))
				}else if(this.chartIndex == 17 && this.flag17 == false){ //浊度(COD)
					this.flag17 = true
					this.series17[0].data = this.CODturbidity
					for(var i = 1;i<=this.CODturbidity.length;i++){
						this.categories17.push(i)
					}
					let res17 = {
					    categories: this.categories17,
					    series: this.series17
					};
					this.chartData17 = JSON.parse(JSON.stringify(res17))
				}else if(this.chartIndex == 18 && this.flag18 == false){ //COD内置温度
					this.flag18 = true
					this.series16[0].data = this.COD_temp
					for(var i = 1;i<=this.COD_temp.length;i++){
						this.categories16.push(i)
					}
					let res16 = {
					    categories: this.categories16,
					    series: this.series16
					};
					this.chartData16 = JSON.parse(JSON.stringify(res16))
				}else if(this.chartIndex == 19 && this.flag19 == false){ //BOD
					this.flag19 = true
					this.series19[0].data = this.BOD
					for(var i = 1;i<=this.BOD.length;i++){
						this.categories19.push(i)
					}
					let res19 = {
					    categories: this.categories19,
					    series: this.series19
					};
					this.chartData19 = JSON.parse(JSON.stringify(res19))
				}else if(this.chartIndex == 20 && this.flag20 == false){ //BOD内置温度
					this.flag20 = true
					this.series20[0].data = this.BOD_temp
					for(var i = 1;i<=this.BOD_temp.length;i++){
						this.categories20.push(i)
					}
					let res20 = {
					    categories: this.categories20,
					    series: this.series20
					};
					this.chartData20 = JSON.parse(JSON.stringify(res20))
				}else if(this.chartIndex == 21 && this.flag21 == false){ //余氯
					this.flag21 = true
					this.series21[0].data = this.CL
					for(var i = 1;i<=this.CL.length;i++){
						this.categories21.push(i)
					}
					let res21 = {
					    categories: this.categories21,
					    series: this.series21
					};
					this.chartData21 = JSON.parse(JSON.stringify(res21))
				}else if(this.chartIndex == 22 && this.flag22 == false){ //余氯内置温度
					this.flag22 = true
					this.series22[0].data = this.CL_temp
					for(var i = 1;i<=this.CL_temp.length;i++){
						this.categories22.push(i)
					}
					let res22 = {
					    categories: this.categories22,
					    series: this.series22
					};
					this.chartData22 = JSON.parse(JSON.stringify(res22))
				}else if(this.chartIndex == 23 && this.flag23 == false){ //叶绿素
					this.flag23 = true
					this.series23[0].data = this.CHLO
					for(var i = 1;i<=this.CHLO.length;i++){
						this.categories23.push(i)
					}
					let res23 = {
					    categories: this.categories23,
					    series: this.series23
					};
					this.chartData23 = JSON.parse(JSON.stringify(res23))
				}else if(this.chartIndex == 24 && this.flag24 == false){ //叶绿素内置温度
					this.flag24 = true
					this.series24[0].data = this.CHLO_temp
					for(var i = 1;i<=this.CHLO_temp.length;i++){
						this.categories24.push(i)
					}
					let res24 = {
					    categories: this.categories24,
					    series: this.series24
					};
					this.chartData24 = JSON.parse(JSON.stringify(res24))
				}else if(this.chartIndex == 25 && this.flag25 == false){ //蓝绿藻
					this.flag25 = true
					this.series25[0].data = this.BGA
					for(var i = 1;i<=this.BGA.length;i++){
						this.categories25.push(i)
					}
					let res25 = {
					    categories: this.categories25,
					    series: this.series25
					};
					this.chartData25 = JSON.parse(JSON.stringify(res25))
				}else if(this.chartIndex == 26 && this.flag26 == false){ //蓝绿藻内置温度
					this.flag26 = true
					this.series26[0].data = this.BGA_temp
					for(var i = 1;i<=this.BGA_temp.length;i++){
						this.categories26.push(i)
					}
					let res26 = {
					    categories: this.categories26,
					    series: this.series26
					};
					this.chartData26 = JSON.parse(JSON.stringify(res26))
				}else if(this.chartIndex == 27 && this.flag27 == false){ //透明度
					this.flag27 = true
					this.series27[0].data = this.TPS
					for(var i = 1;i<=this.TPS.length;i++){
						this.categories27.push(i)
					}
					let res27 = {
					    categories: this.categories27,
					    series: this.series27
					};
					this.chartData27 = JSON.parse(JSON.stringify(res27))
				}else if(this.chartIndex == 28 && this.flag28 == false){ //透明度内置温度
					this.flag28 = true
					this.series28[0].data = this.TPS_temp
					for(var i = 1;i<=this.TPS_temp.length;i++){
						this.categories28.push(i)
					}
					let res28 = {
					    categories: this.categories28,
					    series: this.series28
					};
					this.chartData28 = JSON.parse(JSON.stringify(res28))
				}else if(this.chartIndex == 29 && this.flag29 == false){ //悬浮物
					this.flag29 = true
					this.series29[0].data = this.TSS
					for(var i = 1;i<=this.TSS.length;i++){
						this.categories29.push(i)
					}
					let res29 = {
					    categories: this.categories29,
					    series: this.series29
					};
					this.chartData29 = JSON.parse(JSON.stringify(res29))
				}else if(this.chartIndex == 30 && this.flag30 == false){ //悬浮物内置温度
					this.flag30 = true
					this.series30[0].data = this.TSS_temp
					for(var i = 1;i<=this.TSS_temp.length;i++){
						this.categories30.push(i)
					}
					let res30 = {
					    categories: this.categories30,
					    series: this.series30
					};
					this.chartData30 = JSON.parse(JSON.stringify(res30))
				}else if(this.chartIndex == 31 && this.flag31 == false){ //水中油
					this.flag31 = true
					this.series31[0].data = this.OIL
					for(var i = 1;i<=this.OIL.length;i++){
						this.categories31.push(i)
					}
					let res31 = {
					    categories: this.categories31,
					    series: this.series31
					};
					this.chartData31 = JSON.parse(JSON.stringify(res31))
				}else if(this.chartIndex == 32 && this.flag32 == false){ //水中油内置温度
					this.flag32 = true
					this.series32[0].data = this.OIL_temp
					for(var i = 1;i<=this.CL.length;i++){
						this.categories32.push(i)
					}
					let res32 = {
					    categories: this.categories32,
					    series: this.series32
					};
					this.chartData32 = JSON.parse(JSON.stringify(res32))
				}else if(this.chartIndex == 41 && this.flag41 == false){ //多参数温度
					this.flag41 = true
					this.series41[0].data = this.mul_temp
					for(var i = 1;i<=this.mul_temp.length;i++){
						this.categories41.push(i)
					}
					let res41 = {
					    categories: this.categories41,
					    series: this.series41
					};
					this.chartData41 = JSON.parse(JSON.stringify(res41))
				}else if(this.chartIndex == 42 && this.flag42 == false){ //多参数电导率DDMU
					this.flag42 = true
					this.series42[0].data = this.mul_DDMU
					for(var i = 1;i<=this.mul_temp.length;i++){
						this.categories41.push(i)
					}
					let res41 = {
					    categories: this.categories41,
					    series: this.series41
					};
					this.chartData41 = JSON.parse(JSON.stringify(res41))
				}else if(this.chartIndex == 43 && this.flag43 == false){ //多参数pH
					this.flag43 = true
					this.series43[0].data = this.mul_pH
					for(var i = 1;i<=this.mul_pH.length;i++){
						this.categories43.push(i)
					}
					let res43 = {
					    categories: this.categories43,
					    series: this.series43
					};
					this.chartData43 = JSON.parse(JSON.stringify(res43))
				}else if(this.chartIndex == 44 && this.flag44 == false){ //多参数ORP
					this.flag44 = true
					this.series44[0].data = this.mul_ORP
					for(var i = 1;i<=this.mul_ORP.length;i++){
						this.categories44.push(i)
					}
					let res44 = {
					    categories: this.categories44,
					    series: this.series44
					};
					this.chartData44 = JSON.parse(JSON.stringify(res44))
				}else if(this.chartIndex == 45 && this.flag45 == false){ //多参数溶解氧
					this.flag45 = true
					this.series45[0].data = this.mul_oxygen
					for(var i = 1;i<=this.mul_oxygen.length;i++){
						this.categories45.push(i)
					}
					let res45 = {
					    categories: this.categories45,
					    series: this.series45
					};
					this.chartData45 = JSON.parse(JSON.stringify(res45))
				}else if(this.chartIndex == 46 && this.flag46 == false){ //多参数铵氮/离子类
					this.flag46 = true
					this.series46[0].data = this.mul_ION
					for(var i = 1;i<=this.mul_ION.length;i++){
						this.categories46.push(i)
					}
					let res46 = {
					    categories: this.categories46,
					    series: this.series46
					};
					this.chartData46 = JSON.parse(JSON.stringify(res46))
				}else if(this.chartIndex == 47 && this.flag47 == false){ //多参数浊度
					this.flag47 = true
					this.series47[0].data = this.mul_NTU
					for(var i = 1;i<=this.mul_NTU.length;i++){
						this.categories47.push(i)
					}
					let res47 = {
					    categories: this.categories47,
					    series: this.series47
					};
					this.chartData47 = JSON.parse(JSON.stringify(res47))
				}else if(this.chartIndex == 48 && this.flag48 == false){ //多参数盐度
					this.flag48 = true
					this.series48[0].data = this.mul_DDMS
					for(var i = 1;i<=this.mul_DDMS.length;i++){
						this.categories48.push(i)
					}
					let res48 = {
					    categories: this.categories48,
					    series: this.series48
					};
					this.chartData48 = JSON.parse(JSON.stringify(res48))
				}else if(this.chartIndex == 49 && this.flag49 == false){ //多参数COD
					this.flag49 = true
					this.series49[0].data = this.mul_COD
					for(var i = 1;i<=this.mul_COD.length;i++){
						this.categories49.push(i)
					}
					let res49 = {
					    categories: this.categories49,
					    series: this.series49
					};
					this.chartData49 = JSON.parse(JSON.stringify(res49))
				}else if(this.chartIndex == 50 && this.flag50 == false){ //多参数浊度(COD)
					this.flag50 = true
					this.series50[0].data = this.mul_CODturbidity
					for(var i = 1;i<=this.mul_CODturbidity.length;i++){
						this.categories50.push(i)
					}
					let res50 = {
					    categories: this.categories50,
					    series: this.series50
					};
					this.chartData50 = JSON.parse(JSON.stringify(res50))
				}else if(this.chartIndex == 51 && this.flag51 == false){ //多参数BOD
					this.flag51 = true
					this.series51[0].data = this.mul_BOD
					for(var i = 1;i<=this.mul_BOD.length;i++){
						this.categories51.push(i)
					}
					let res51 = {
					    categories: this.categories51,
					    series: this.series51
					};
					this.chartData51 = JSON.parse(JSON.stringify(res51))
				}else if(this.chartIndex == 52 && this.flag52 == false){ //多参数余氯
					this.flag52 = true
					this.series52[0].data = this.mul_CL
					for(var i = 1;i<=this.mul_CL.length;i++){
						this.categories52.push(i)
					}
					let res52 = {
					    categories: this.categories52,
					    series: this.series52
					};
					this.chartData52 = JSON.parse(JSON.stringify(res52))
				}else if(this.chartIndex == 53 && this.flag53 == false){ //多参数叶绿素
					this.flag53 = true
					this.series53[0].data = this.mul_CHLO
					for(var i = 1;i<=this.mul_CHLO.length;i++){
						this.categories41.push(i)
					}
					let res53 = {
					    categories: this.categories53,
					    series: this.series53
					};
					this.chartData53 = JSON.parse(JSON.stringify(res53))
				}else if(this.chartIndex == 54 && this.flag54 == false){ //多参数蓝绿藻
					this.flag54 = true
					this.series54[0].data = this.mul_BGA
					for(var i = 1;i<=this.mul_BGA.length;i++){
						this.categories54.push(i)
					}
					let res54 = {
					    categories: this.categories54,
					    series: this.series54
					};
					this.chartData54 = JSON.parse(JSON.stringify(res54))
				}else if(this.chartIndex == 55 && this.flag55 == false){ //多参数透明度
					this.flag55 = true
					this.series55[0].data = this.mul_TPS
					for(var i = 1;i<=this.mul_TPS.length;i++){
						this.categories55.push(i)
					}
					let res55 = {
					    categories: this.categories55,
					    series: this.series55
					};
					this.chartData55 = JSON.parse(JSON.stringify(res55))
				}else if(this.chartIndex == 56 && this.flag56 == false){ //多参数悬浮物
					this.flag56 = true
					this.series56[0].data = this.mul_TSS
					for(var i = 1;i<=this.mul_TSS.length;i++){
						this.categories56.push(i)
					}
					let res56 = {
					    categories: this.categories56,
					    series: this.series56
					};
					this.chartData56 = JSON.parse(JSON.stringify(res56))
				}else if(this.chartIndex == 57 && this.flag57 == false){ //多参数水中油
					this.flag57 = true
					this.series57[0].data = this.mul_OIL
					for(var i = 1;i<=this.mul_OIL.length;i++){
						this.categories57.push(i)
					}
					let res57 = {
					    categories: this.categories57,
					    series: this.series57
					};
					this.chartData57 = JSON.parse(JSON.stringify(res57))
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #dff9fb;
	}
	
	.row{
		display: flex;
		flex-direction: row;
	}
	
	.column{
		display: flex;
		flex-direction: column;
	}
	
	.button{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 700rpx;
		border-radius: 25px;
	}
	
	.top_box{
		width: 100%;
		height: auto;
		background-color: #ffffff;
	}
	
	.charts-box {
		width: 100%;
		height: auto;
		border-radius: 30rpx;
		background-color: rgb(255, 255, 255);
	}
</style>