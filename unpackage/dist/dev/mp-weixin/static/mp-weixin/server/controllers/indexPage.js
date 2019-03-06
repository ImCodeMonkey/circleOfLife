module.exports = {
    // 加载首页banner
    banner: ctx => {
        var data = [
        				{"title":"快递服务","image":"../../../static/kuaidi_banner.jpg","href":"/pages/expressService/expressService","background":"#2059a8"},
						{"title":"快递服务","image":"../../../static/kuaidi_banner.jpg","href":"/pages/expressService/expressService","background":"#2059a8"}
        			];
        ctx.state.data = data
    },

    // 加载首页宫格
    grid: ctx => {
		var data = [
						{"image":"../../../static/list/kuaidi.png","text":"快递服务","href":"/pages/expressService/expressService"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png","text":"铃铛"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/laoren.png","text":"圣诞老人"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/liwu.png","text":"礼物"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/maozi.png","text":"帽子"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/shoutao.png","text":"手套"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/xueqiao.png","text":"雪橇"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/xunlu.png","text":"驯鹿"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/shu.png","text":"圣诞树"},
						{"image":"https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png","text":"铃铛"}
					];
		ctx.state.data = data
    }

}