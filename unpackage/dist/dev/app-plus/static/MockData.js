const userData = {
	name: "ITHANG",
	headimgurl: "/static/ithang/logo.jpg",
	id: "28***06",
	phone: "136***4399",
	withdrawable: 215.25,
	coming: 255.88,
	came: 468.55,
	withdrawed: 156.32
}

const income = {
	month: [{
		order_no: 202305042514821,
		name:'完成 大冒险 任务',
		money: 20.25,
		status: 1,
		create_time: '2023.01.04 15:20'
	}, {
		order_no: 202305052514523,
		name:'好友完成任务',
		money: 15.35,
		status: 1,
		create_time: '2023.01.05 22:46'
	}, {
		order_no: 202305062515747,
		name:'开盲盒奖励',
		money: 37.85,
		status: 1,
		create_time: '2023.01.06 12:36'
	}, {
		order_no: 202305072514141,
		name:'邀请好友奖励',
		money: 28.75,
		status: 1,
		create_time: '2023.01.07 20:18'
	}],
	today: [{
		order_no: 202305072514141,
		name:'邀请好友奖励',
		money: 12.75,
		status: 1,
		create_time: '2023.01.07 20:18'
	}, {
		order_no: 202305072514141,
		name:'邀请好友奖励',
		money: 11.75,
		status: 1,
		create_time: '2023.01.07 20:18'
	}],
	yesterday: [{
		order_no: 202305062515747,
		name:'邀请好友奖励',
		money: 35.85,
		status: 1,
		create_time: '2023.01.06 12:36'
	}],
	list: [{
		order_no: 202305062515763,
		name:'提现成功',
		real_money: '20.00',
		money: 27.88,
		status: 1,
		create_time: '2023.01.02 12:36'
	}, {
		order_no: 202305062515778,
		name:'提现成功',
		real_money: '50.00',
		money: 58.63,
		status: 1,
		create_time: '2023.01.03 11:36'
	}, {
		order_no: 202305062515778,
		name:'提现审核中',
		real_money: '50.00',
		money: 58.63,
		status: 2,
		create_time: '2023.01.03 11:36'
	}, {
		order_no: 202305062515778,
		name:'系统判定为作弊',
		real_money: '50.00',
		money: 58.63,
		status: 3,
		create_time: '2023.01.03 11:36'
	}]
}

const pool = {
	pool: "128.28",
	least_money: 10,
	fee: "20",
}

export default {
	userData,
	incomeMonth: income.month,
	incomeToday: income.today,
	incomeYesterday: income.yesterday,
	incomeList: income.list,
	pool
}
