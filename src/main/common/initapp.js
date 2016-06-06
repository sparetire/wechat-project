var WeChatAPI = require('./wechat/wechatapi');
var WeChatAPIConfig = require('../conf/wechatapisconf');

var wechatAPI = new WeChatAPI(WeChatAPIConfig);
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

console.log(wechatAPI.accessToken);
wechatAPI.accessToken.get({
		appid: 'wxcc8c4ee913205b55',
		secret: 'feb3737e464b1b34cce8420ea5066538'
	})
	.then((args) => {
		console.log(args[2]);
	});