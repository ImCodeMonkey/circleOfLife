const mysql = require('./index')

/**
 * 个人资料页面数据查询
 * 接收参数：{openId: 用户标识}
 * 反回参数：{phone: 手机号码, address: 地址, autograph: 个性签名, birthday: 生日}
 * SQL SELECT `*` FROM `userInfo` WHERE `open_id` = ''
 */
let personalQuery = async function(data){
	let personal = await mysql.select('phone', 'address', 'autograph', 'birthday').from('userInfo').where({open_id: data.openId}).then(async function(datas){
		//当记录不存在时执行
		if(datas.length < 1){
			let state = await mysql.insert({
				open_id: data.openId,
				phone: null,
				address: null,
				autograph: null,
				birthday: null
			}).from('userInfo').then(function(state){
				console.log(state)
				return state
			})
		}
		return datas
	})
	return personal
}


/**
 * 个人资料页面数据修改
 * 接收参数：{openId: 用户标识, phone: 手机号码, address: 地址, autograph: 个性签名, birthday: 生日}
 * SQL UPDATE `userInfo` SET `address` = '13552521698', `autograph` = '美好的事情即将发生', `birthday` = '13552521698', `phone` = '13552521698' WHERE `open_id` = 'o9j6f4vx2RIk8aG-FooPYGOGJOIc'
 */
let personalEdit = async function(data){
	let personal = await mysql.update({
		phone: data.phone,
		address: data.address,
		autograph: data.autograph,
		birthday: data.birthday
	}).from('userInfo').where({open_id: data.openId}).then(function(datas){
		return datas
	})
	return personal
}

/**
 * 关于圈子页面数据接口
 * 接收参数：无
 * SQL: SELECT about FROM systemInfo
 */
let loadAbout = new Promise(function(resolve, reject) {
	resolve(mysql.select('about').from('systemInfo'))
})

module.exports = {
	personalQuery,
	personalEdit,
    loadAbout
}
