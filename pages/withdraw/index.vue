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
		<view class="withdraw">
			<view class="withdraw-head">
				<view class="withdraw-head-to">到账渠道</view>
				<view class="withdraw-head-way">
					<view class="withdraw-head-way-1">
						<image class="way-icon" src="/static/money.png"></image>
						<text class="way-text">微信零钱</text>
					</view>
					<view class="withdraw-head-way-2">仅支持整数，72小时内到账</view>
				</view>
			</view>
			<view class="withdraw-body">
				<text>提现金额</text>
				<view class="input-money">
					<text class="rmb">￥</text>
					<input v-model.number="extract" type="text" @focus.prevent="stopKeyborad" class="t-input" />
				</view>
				<view class="info-money">
					<view v-if="is_out">
						<text class="info-money-num" style="color: #ff1e0f;">输入金额超过可提现余额，账户余额{{ pool }}元</text>
					</view>
					<view v-else-if="is_lowest">
						<text class="info-money-num" style="color: #ff1e0f;">最低{{ lowest }}元起提现，账户余额{{ pool }}元</text>
					</view>
					<view v-else>
						<text class="info-money-num">当前可提现余额{{ pool }}元，</text>
						<text class="info-money-all" @click="getAll">全部提现</text>
					</view>
				</view>
				<view :class="'tx' + (is_post ? '-active' : '')"><button @click="handleShowModel">提现</button></view>
			</view>

			<view :class="['keyboard', keyboradShow ? '' : 'active', isIphoneX ? 'isIphone' : '']">
				<block v-for="(item, index) in 9" :key="index">
					<view class="keyboard-item" @tap="keyboradKey(index + 1)">{{ index + 1 }}</view>
				</block>
				<view class="keyboard-item hide"></view>
				<view class="keyboard-item" @tap="keyboradKey(0)"><text>0</text></view>
				<view class="keyboard-item delte" @tap="keyboradDel()">
					<image class="img" src="/static/del.png" mode="aspectFill" :lazy-load="true"></image>
				</view>
			</view>
			<u-modal :show="showModal" title="提现确认" showCancelButton cancelText="我再想想" confirmColor="#ff1e0f"
				confirmText="确认提现" @confirm="getMoney" @cancel="showModal = false">
				<view class="slot-content">
					<rich-text :nodes="content"></rich-text>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pool: 0,
				extract: '',
				service_fee: 0.0,
				showModal: false,
				is_out: false,
				is_lowest: false,
				is_post: false,
				lowest: 0,
				fee: 0,
				money: '',
				real_money: '',
				keyboradShow: false,
				isIphoneX: false,
				isRefuse: false,
				content: ""
			};
		},
		watch: {
			extract(oldVal, newVal) {}
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
				const res = await this.$api.mock('pool');
				this.lowest = res.least_money;
				this.fee = res.fee;
				this.pool = res.pool;
				this.$nextTick(() => {
					this.keyboradShow = true;
				});
			},
			stopKeyborad() {
				uni.hideKeyboard();
			},
			keyboradKey(key) {
				this.extract = this.extract * 10 + key;
				this.checkMoney();
			},
			keyboradDel() {
				if (this.extract && this.extract > 0) {
					let val = parseInt(this.extract / 10);
					if (val == 0) val = '';
					this.extract = val;
					this.checkMoney();
				}
			},
			getAll() {
				this.extract = parseInt(this.pool);
				this.checkMoney();
			},
			checkMoney() {
				if (!this.extract || this.extract < this.lowest) {
					this.is_lowest = true;
					this.is_post = false;
				} else if (this.extract > this.pool) {
					this.is_out = true;
					this.is_lowest = false;
					this.is_post = false;
				} else {
					this.is_out = false;
					this.is_lowest = false;
					this.is_post = true;
				}
				if (parseFloat(this.extract).toString() == 'NaN') {
					this.is_post = false;
					this.$api.msg('输入金额不合法');
				}
			},
			handleShowModel() {
				if (this.isRefuse) return;
				this.checkMoney();
				if (!this.is_post) return;
				this.money = this.extract;
				this.service_fee = Number((this.extract * (this.fee / 100)).toString().match(/^\d+(?:\.\d{0,2})?/));
				this.real_money = Number((this.extract - this.service_fee).toString().match(/^\d+(?:\.\d{0,2})?/));
				this.content = `<p>提现金额：<em style="font-style:normal;color:#ff1e0f">${this.money} 元</p>
				          <p>实际到账：<em style="font-style:normal;color:#ff1e0f">${this.real_money} 元</em></p>
				          <p>服务费用：<em style="font-style:normal;color:#ff1e0f">${this.service_fee} 元</em></p>
				          <p>服务费率：<em style="font-style:normal;color:#ff1e0f">${this.fee}%</em></p>
				         `
				this.showModal = true;
			},
			getMoney() {
				this.showModal = false;
				if (this.isRefuse) return;
				this.isRefuse = true;
				setTimeout(() => {
					uni.showToast({
						title: "提现申请已提交，等待审核",
						mask: false,
						icon: 'none'
					});
				}, 500);
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			}
		},
		onPullDownRefresh() {
			this.extract = '';
			this.initData();
			this.is_out = false;
			this.is_lowest = false;
			this.is_post = false;
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		}
	};
</script>

<style>
	page {
		background-color: #ededed;
	}
</style>

<style lang="scss" scoped>
	::v-deep .u-modal__content {
		justify-content: flex-start;
	}

	.ithui {
		&-content {
			.withdraw {
				padding: 40rpx;

				&-head {
					background-color: #f7f7f7;
					display: flex;
					align-content: center;
					padding: 40rpx 60rpx;
					font-size: 28rpx;

					&-to {}

					&-way {
						display: flex;
						flex-direction: column;
						align-content: center;
						margin-left: 40rpx;

						&-1 {
							color: #576b95;
							margin-bottom: 20rpx;

							.way-icon {
								width: 36rpx;
								height: 36rpx;
								margin-right: 10rpx;
								top: 4rpx;
							}
						}

						&-2 {
							color: #acacac;
							font-size: 26rpx;
						}
					}
				}

				&-body {
					background-color: #fff;
					padding: 40rpx 60rpx;
					font-size: 28rpx;

					.input-money {
						display: flex;
						align-content: center;
						font-weight: 600;
						border-bottom: 1rpx solid #eaeef1;

						.rmb {
							font-size: 2em;
							top: 20rpx;
							position: relative;
						}

						.t-input {
							height: 1.9em;
							font-size: 2.5em;
							border: none;
							position: relative;
							left: 3.5%;
							outline: none;
						}
					}

					.info-money {
						margin-top: 20rpx;
						font-size: 24rpx;
						margin-bottom: 40rpx;

						&-num {
							color: #b2b2b2;
						}

						&-all {
							color: #576b95;
						}
					}

					.tx {
						button {
							color: #b2b2b2;
						}
					}

					.tx-active {
						button {
							color: #fff;
							background: #07c160;
						}
					}
				}

				.keyboard {
					position: fixed;
					bottom: 0;
					left: 0;
					width: 100%;
					background: #ebebeb;
					display: flex;
					justify-content: center;
					z-index: 2;
					flex-wrap: wrap;
					transition: all 0.2s ease-in 0.2s;
				}

				.active {
					bottom: -400rpx;
				}

				.keyboard-item {
					box-sizing: border-box;
					width: 250rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background: #fff;
					font-size: 40rpx;
					color: #333;
					height: 99rpx;
					border: 1rpx solid #ebebeb;
					border-top: none;
					border-left: none;
				}

				.hide {
					opacity: 0;
				}

				.delte {
					background: none;
					box-shadow: none;
				}

				.delte image {
					width: 60rpx;
					height: 60rpx;
				}

				.isIphone {
					padding-bottom: 68rpx !important;
				}

				.fee {
					em {
						font-size: 0.5rem;
						font-style: normal;
					}
				}
			}
		}
	}
</style>
