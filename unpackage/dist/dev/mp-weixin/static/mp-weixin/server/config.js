const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wxec71e6f57dfe07f3',

    // 微信小程序 App Secret
    appSecret: 'c1da26670c1772ce9f026115f41aac13',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,
    qcloudAppId: '1258018576',
    qcloudSecretId: 'AKID2xgDZjcx51uc8SzWGonfOwMacS6YpCF6',
    qcloudSecretKey: 'nOn01tZt32pRr9E8sQmwugGeLqAMQIzX',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
		//开发环境
        //host: 'localhost',
		//生产环境
		host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
		//开发环境
		//pass: 'wxec71e6f57dfe07f3',
		//生产环境
        pass: '18332582342liwei',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
