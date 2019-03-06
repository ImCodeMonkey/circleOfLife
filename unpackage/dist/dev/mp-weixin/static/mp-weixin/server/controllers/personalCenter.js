//sql查询库
const AuthDbService = require('../mysql/AuthDbService')

module.exports = {
	/**
	 * 个人资料页面数据查询
	 * 接收参数：{openId: 用户标识}
	 * 反回参数：{phone: 手机号码, address: 地址, autograph: 个性签名, birthday: 生日}
	 */
	personalQuery: async ctx => {
		let requestData = {
			openId: ctx.request.body.openId || 'o9j6f4vx2RIk8aG-FooPYGOGJOIc'
		}
		var personal = await AuthDbService.personalQuery(requestData);
		ctx.state.data = personal;
	},
	/**
	 * 个人资料页面数据修改
	 * 接收参数：{openId: 用户标识, phone: 手机号码, address: 地址, autograph: 个性签名, birthday: 生日}
	 */
	personalEdit: async ctx => {
		let requestData = {
			openId: ctx.request.body.openId || 'o9j6f4vx2RIk8aG-FooPYGOGJOIc',
			phone: ctx.request.body.phone || '13552521698',
			address: ctx.request.body.phone || '13552521698',
			autograph: ctx.request.body.phone || '美好的事情即将发生',
			birthday: ctx.request.body.phone || '13552521698',
		}
		var personal = await AuthDbService.personalEdit(requestData);
		if(personal == 1){
			ctx.state.message = '修改成功'
		}else{
			ctx.state.message = '修改失败'
		}
		ctx.state.data = requestData
	},
    /**
     * 关于圈子页面数据接口
     * 接收参数：无
     */
    about: ctx => {
		AuthDbService.loadAbout.then(data => {
			ctx.state.data = data
		})
    }
}