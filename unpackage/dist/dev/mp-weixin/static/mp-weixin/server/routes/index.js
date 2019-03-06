/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: ''
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')


// ---  S首页接口  --- //

/**
 * banner接口
 * 接收参数：无
 */
router.post('/indexBanner', controllers.indexPage.banner);

/**
 * 宫格接口
 * 接收参数：无
 */
router.post('/indexGrid', controllers.indexPage.grid);

// ---  E首页接口  --- //

// ---  S快递服务  --- //

/**
 * 快递公司查询
 * 接收参数：{LogisticCode : 运单号}
 */
router.post('/companyIdentification', controllers.express.companyIdentification);

/**
 * 快递查询
 * 接收参数：{LogisticCode: 运单号, ShipperCode: 快递公司编号}
 */
router.post('/expressInquiry', controllers.express.expressInquiry);

// ---  E快递服务  --- //

// ---  S设置页面  --- //

/**
 * 个人资料页面数据查询
 * 接收参数：无
 */
router.post('/personalCenter/personalQuery', controllers.personalCenter.personalQuery);

/**
 * 个人资料页面数据修改
 * 接收参数：无
 */
router.post('/personalCenter/personalEdit', controllers.personalCenter.personalEdit);

/**
 * 关于圈子页面数据接口
 * 接收参数：无
 */
router.post('/personalCenter/about', controllers.personalCenter.about);

// ---  E设置页面  --- //










// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

module.exports = router
