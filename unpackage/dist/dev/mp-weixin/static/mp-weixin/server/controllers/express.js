//  api系统信息  //
//电商ID
let EBusinessID = '1432759';
//电商加密私钥，快递鸟提供，注意保管，不要泄漏
var AppKey = '0c2a63c1-9990-420f-99d7-aba375ebfdcd';

var axios = require('axios');

var md5 =require("md5");

var urlencode = require('urlencode');

//快递查询错误描述
function errorMessage(code, msg){
	var message = msg || '请联系开发者。';
	message = code == '100' ? '查询成功':message;
	message = code == '105' ? '请检查您的信息':message;
	return message
}

/**
	 * 报文处理
	 * dataList参数信息:
	 * requestData: 请求参数
	 * RequestType: 请求接口指令 
	 **/
async function messageProcessing(dataList){
	//将请求参数转换为字符串
	var jsonStr = JSON.stringify(dataList.requestData);
	var datasign = urlencode(Buffer.from(md5(jsonStr + AppKey)).toString('base64'));
	var PostStr = "RequestType="+ dataList.RequestType +"&EBusinessID="+ EBusinessID +"&RequestData="+ urlencode(jsonStr) +"&DataSign="+ datasign +"&DataType=2";
	return PostStr
}

/**
	 * axios请求
	 * dataList参数信息
	 * 
	 * method: 请求方式
	 * url : 请求接口
	 * data : 请求数据
	 * headers : 请求头设置
	 * 
	 **/
async function axiosLoad(dataList) {
	//axops请求器
	var loadData = await axios({
		method: dataList.method || "post",
		url: dataList.url || "",
		data: dataList.data,
		headers: dataList.headers || {
			"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
		},
		transformRequest: [function (data) {
			return data
		}]
	})
	.then(function (response) {
		return response.data;
	})
	.catch(function (error) {
		return error;
	});
	//输出反回结果
	return loadData;
};


module.exports = {
	// 快递公司识别
	companyIdentification: async ctx => {
		//报文信息
		var messageData = await messageProcessing({
			requestData : {
				LogisticCode: ctx.request.body.LogisticCode
			},
			RequestType : "2002"
		});
		//请求反回结果
		var data = await axiosLoad({
			url: "http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx",
			data: messageData
		});
		ctx.state = {
			code: data.Code == 100 ? 0 : 1,
			message: errorMessage(data.Code),
			data: data.Shippers
		}
	},
    // 查询快递单号
    expressInquiry: async ctx => {
		//报文信息
		var messageData = await messageProcessing({
			requestData : {
				OrderCode:"",
				ShipperCode: ctx.request.body.ShipperCode,
				LogisticCode: ctx.request.body.LogisticCode,
				IsHandleInfo:"0"
			},
			RequestType : "1002"
		});
		//请求反回结果
		var data = await axiosLoad({
			url: "http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx",
			data: messageData
		});
		ctx.body = {
			message: errorMessage(data.Success == true?100:105, data.Reason),
			data: data.Traces,
			success: data.Success,
			state: data.State
		}
    }
}



