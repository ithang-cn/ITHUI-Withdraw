/**
* ITHUI®
* ITHUI-Withdraw适用于余额管理、提现页面，兼容小程序、APP、H5，兼容H5、小程序、APP。
* Copyright (c) 2023 ITHANG All rights reserved.
* Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
* 复制使用请保留本段注释，感谢支持开源！
*
* 作者主页
* https://ithang.cn/
*
* 开源地址:
* https://github.com/ithang-cn/ITHUI-Withdraw
* https://gitee.com/ithang-cn/ITHUI-Withdraw
*
*/

<template>
	<view class="ithui-content">
		<!-- #ifndef H5 -->
		<view class="h5title">我的余额</view>
		<!-- #endif -->
		<view class="ithui-view">
			<view class="view-info">
				<view class="userinfo">
					<view class="flex">
						<image class="userinfo-headimg" :src="userData.headimgurl" mode="aspectFill" />
						<view class="flex-one">
							<view class="flex-one-text">用户名：{{ userData.name }}({{ userData.id }})</view>
							<view class="flex-one-text">手机号：{{ userData.phone }}</view>
						</view>
						<view class="arrow arrow-one" @click="showModal = true"><span>名词解释</span></view>
					</view>
				</view>
				<u-modal :show="showModal" title="名词解释" confirmText="我已知晓" @confirm="showModal = false"
					confirmColor="#ff1e0f">
					<view class="slot-content">
						<rich-text :nodes="content"></rich-text>
					</view>
				</u-modal>
				<view class="box">
					<view class="tx">
						<view class="tx-grid">
							<view class="tx-grid-text">
								<view class="title">可提现余额</view>
								<view class="money">
									<text>{{ userData.withdrawable }}</text>
									<text class="money-b">元</text>
								</view>
							</view>
						</view>
						<view class="tx-grid" @click="navTo('/pages/withdraw/index')"><span
								class="tx-grid-comm-sign">立即提现</span></view>
					</view>
					<view class="palace palace-one">
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text>{{ userData.coming }}</text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">即将到账</view>
							</view>
						</view>
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text>{{ userData.came }}</text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">累计到账</view>
							</view>
						</view>
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text>{{ userData.withdrawed }}</text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">累计提现</view>
							</view>
						</view>
					</view>
				</view>
				<view class="top">
					<u-subsection :list="tabs" fontSize="32" activeColor="#ff8440" :current="tabIndex"
						@change="changeTab"></u-subsection>
					<u-empty v-if="list.length === 0" style="margin-top: 40rpx;" mode="order" text="没有记录" iconSize="140"
						textSize="32">
					</u-empty>
				</view>
				<view class="list-view">
					<view class="list-item" v-for="(item, index) in list" :key="index" hover-class="hover"
						:hover-stay-time="150" bindtap="detail">
						<view class="content-box">
							<view class="des-box">
								<view class="tit">
									{{ item.name }}
								</view>
								<view v-if="tabIndex == 3" class="source"
									:style="{ color: item.status == 1 ? '#4caf50' : item.status == 2 ? '#00b7ff' : '#ff1e0f' }">
									提现{{ item.status == 1 ? '成功' : item.status == 2 ? '处理中' : '失败' }}
								</view>
								<view class="time">{{ item.create_time }}</view>
							</view>
						</view>
						<view class="money" :class="{ less: is_withdraw }">
							{{ is_withdraw ? '-' : '+' }}{{ tabIndex == 3 ? item.real_money : item.money }}
						</view>
					</view>
				</view>
				<view class="tip">仅显示近一年内的收支记录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_withdraw: false,
				list: [],
				userData: {},
				showModal: false,
				date: 'incomeMonth',
				content: `<p><em style="font-style:normal;color:#ff1e0f">可提现余额：</em>当前可以提现的金额</p>
				          <p><em style="font-style:normal;color:#ff1e0f">即将到账：</em>交易中的金额，交易成功后可提现</p>
				          <p><em style="font-style:normal;color:#ff1e0f">累计到账：</em>累计交易成功的金额</p>
				          <p><em style="font-style:normal;color:#ff1e0f">累计提现：</em>累计提现成功的金额</p>
				          <p><em style="font-style:normal;color:#ff1e0f">*注：所有金额币种均为人民币，单位为元，符号￥</em></p>
				         `,
				tabs: ['本月收入', '今日收入', '昨日收入', '提现记录'],
				tabIndex: 0
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			});
			this.initData();
			setTimeout(() => {
				uni.hideLoading();
			}, 500);
		},
		methods: {
			async initData() {
				this.tabIndex = 0;
				this.userData = await this.$api.mock('userData');
				this.list = await this.$api.mock('incomeMonth');
			},
			async getFundList() {
				this.list = await this.$api.mock(this.date);
			},
			changeTab(index) {
				this.tabIndex = index;
				this.list = []
				if (this.tabIndex == 0) {
					this.date = 'incomeMonth';
					this.is_withdraw = false;
				} else if (this.tabIndex == 1) {
					this.date = 'incomeToday';
					this.is_withdraw = false;
				} else if (this.tabIndex == 2) {
					this.date = 'incomeYesterday';
					this.is_withdraw = false;
				} else if (this.tabIndex == 3) {
					this.date = 'incomeList';
					this.is_withdraw = true;
				}
				uni.showLoading({
					title: '加载中'
				});
				this.getFundList();
				setTimeout(() => {
					uni.hideLoading();
				}, 500);
			},
			navTo(url) {
				uni.navigateTo({
					url
				});
			}
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中'
			});
			this.showModal = false
			this.initData();
			setTimeout(() => {
				uni.hideLoading();
			}, 500);
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style lang="scss" scoped>
	::v-deep .u-modal__content {
		justify-content: flex-start;
	}

	.flex {
		display: flex;
		align-items: center;
		padding: 50rpx;
		position: relative;

		&-one {
			flex: 1;
			min-width: 0;
			font-size: 26rpx;
			color: #333;

			&-text {
				margin: 10rpx 0;
				color: #f5f5f5;
				font-weight: normal;
			}
		}
	}


	.ithui {
		&-content {
			.h5title {
				width: 100%;
				height: 120rpx;
				text-align: center;
				line-height: 200rpx;
				color: white;
				font-size: 34rpx;
				font-weight: bold;
				background: linear-gradient(to right, #ff8440, #ff1e0f);
			}

			.list-view {
				position: relative;
				width: 100%;
				overflow: hidden;
			}

			.list-item {
				width: 100%;
				padding: 30rpx 28rpx;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				border-bottom: 1rpx solid #eaeef1;
			}

			.item-last::after {
				left: 0 !important;
			}

			.content-box {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
			}

			.des-box {
				min-height: 80rpx;
				padding-left: 28rpx;
				box-sizing: border-box;
				vertical-align: top;
				color: #333;
				font-size: 28rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}

			.tit {
				font-size: 32rpx;
				max-width: 420rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.source {
				margin: 12rpx 0;
			}

			.time {
				color: #888;
			}

			.money {
				font-size: 38rpx;
				font-weight: 500;
				color: #ff1e0f;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding-left: 20rpx;
			}

			.less {
				color: #4caf50 !important;
			}

			.tip {
				margin-top: 50rpx;
				display: flex;
				justify-content: center;
				align-content: center;
				font-size: 24rpx;
				color: #888;
			}

		}

		&-view {
			width: 100%;
			height: 100%;
			margin: 0 auto;
			display: flex;
			flex-direction: column;

			.view-info {
				width: 100%;
				height: 100%;
				flex: 1;
				overflow-y: auto;
				overflow-x: hidden;
				position: relative;
				padding-bottom: 116rpx;

				.userinfo {
					background: linear-gradient(to right, #ff8440, #ff1e0f);
					background-color: #ff8440;
					padding-bottom: 100rpx;


					.userinfo-headimg {
						width: 130rpx;
						height: 130rpx;
						border-radius: 100%;
						overflow: hidden;
						margin-right: 20rpx;
						border: 4rpx solid rgba(255, 255, 255, 0.3);
					}


					.arrow {
						position: relative;
						padding-right: 30rpx;

						span {
							font-size: 28rpx;
							color: white;
						}

						&:after {
							content: ' ';
							display: inline-block;
							height: 12rpx;
							width: 12rpx;
							border-width: 4rpx 4rpx 0 0;
							border-color: #848484;
							border-style: solid;
							transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
							position: relative;
							top: -4rpx;
							position: absolute;
							top: 50%;
							margin-top: -8rpx;
							right: 4rpx;
							border-radius: 2rpx;
						}
					}

					.arrow-one:after {
						border-color: white;
						margin-top: -6rpx;
					}
				}

				.box {
					width: 94%;
					background: white;
					border-radius: 10rpx;
					margin: -120rpx auto 20rpx;
					box-shadow: 0 6rpx 20rpx #e7e7e7;

					.tx {
						padding-top: 26rpx;
						overflow: hidden;
						display: flex;
						justify-content: space-between;
						align-content: center;

						&-grid {
							box-sizing: border-box;

							&:first-child {
								margin-left: 40rpx;
							}

							&-comm-sign {
								display: block;
								border-radius: 40rpx 0 0 40rpx;
								font-size: 26rpx;
								padding: 16rpx 44rpx;
								background: linear-gradient(to right, #fef082, #ffc551);
								background-color: #fef082;
								color: #cf4400;
							}

							&-text {
								display: block;
								color: #333;
								font-size: 26rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;

								.title {
									font-size: 32rpx;
									font-weight: normal;
									color: #ff6423;
								}

								.money {
									font-size: 60rpx;
									color: #ff6423;
									letter-spacing: 2rpx;
									margin-bottom: 10rpx;

									&-b {
										font-size: 28rpx;
									}
								}
							}
						}
					}

					.palace {
						padding-bottom: 20rpx;
						overflow: hidden;
						display: flex;
						justify-content: center;

						&-grid {
							flex: 1;
							position: relative;
							box-sizing: border-box;

							&:not(:last-child) {
								&:after {
									width: 1rpx;
									height: 80rpx;
									background: #fddece;
									content: ' ';
									display: inline-block;
									position: absolute;
									top: 0;
									right: 0;
								}
							}

							&-text {
								display: block;
								text-align: center;
								color: #333;
								font-size: 32rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;

								&-name {
									font-size: 26rpx;
									font-weight: normal;
									color: #ff8a4a;
								}

								&-data {
									font-size: 32rpx;
									color: #ff8a4a;
									letter-spacing: 2rpx;
									margin-bottom: 5rpx;

									&-b {
										font-size: 20rpx;
									}
								}
							}
						}
					}
				}
			}
		}

	}
</style>
