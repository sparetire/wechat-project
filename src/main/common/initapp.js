const WeChatAPIConfig = require('../conf/wechatapisconf');
const WeChatAPI = require('./wechat/wechatapi');
const WeChatConfig = require('../conf/wechatconf');
const WeChatInfo = require('./wechat/wechatinfo');
const AccessToken = require('./wechat/accesstoken');
const dbConfig = require('../conf/mongodbconf');
const MongoDB = require('./mongodb');
const DataHolder = require('./wechat/dataholder');
const co = require('co');

var wechatInfo = WeChatInfo.getInstance(WeChatConfig);
var wechatAPI = new WeChatAPI(WeChatAPIConfig);
var mongoDB = MongoDB.getInstance(dbConfig);
var dataHolder = new DataHolder(mongoDB.wechat);
var accessToken = AccessToken.getInstance({
	apiObject: wechatAPI.accessToken,
	dataHolder: dataHolder,
	wechatInfo: wechatInfo
});

// co(accessToken.getAccessToken)
// 	.then((data) => {
// 		console.log(data);
// 	});
// co(accessToken.getAccessToken)
// 	.then((data) => {
// 		console.log(data);
// 	});
// co(accessToken.getAccessToken)
// 	.then((data) => {
// 		console.log(data);
// 	});




// wechatAPI.fuck.post({
// 	url: 'http://www.chetong.net/api/check/usertype',
// 	json: true,
// 	// proxy: 'http://127.0.0.1:9876',
// 	headers: {
// 		'Host': 'www.chetong.net',
// 		'Accept': '*/*',
// 		'Origin': 'http://www.chetong.net',
// 		'X-Requested-With': 'XMLHttpRequest',
// 		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
// 		'Content-Type': 'application/json; charset=UTF-8',
// 		'Referer': 'http://www.chetong.net/',
// 		'Accept-Encoding': 'gzip, deflate',
// 		'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2,ja;q=0.2',
// 		'Connection': 'close'
// 	},
// 	body: {
// 		checkUserType: {
// 			loginName: 'adflkjglkj'
// 		}
// 	}
// }, true, (err, resp, body) => {
// 	console.log(body);
// });


// wechatAPI.fuck.post({
// 		url: 'http://www.chetong.net/api/check/usertype',
// 		json: true,
// 		// proxy: 'http://127.0.0.1:9876',
// 		headers: {
// 			'Host': 'www.chetong.net',
// 			'Accept': '*/*',
// 			'Origin': 'http://www.chetong.net',
// 			'X-Requested-With': 'XMLHttpRequest',
// 			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
// 			'Content-Type': 'application/json; charset=UTF-8',
// 			'Referer': 'http://www.chetong.net/',
// 			'Accept-Encoding': 'gzip, deflate',
// 			'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2,ja;q=0.2',
// 			'Connection': 'close'
// 		},
// 		body: {
// 			checkUserType: {
// 				loginName: 'adflkjglkj'
// 			}
// 		}
// 	}, true)
// 	.then((args) => {
// 		console.log(args[2]);
// 	});

// console.log(wechatAPI.accessToken);
// wechatAPI.accessToken.get({
// 		appid: wechatInfo.appid,
// 		secret: wechatInfo.appSecret
// 	})
// 	.then((args) => {
// 		console.log(args[2]);
// 	});

// wechatAPI.rest.get({
// 		name: 'tom',
// 		password: '123'
// 	})
// 	.then((args) => {
// 		console.log(args[2]);
// 	});