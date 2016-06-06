// 继承API类

var API = require('../api');

function WeChatAPI(opts) {
	API.call(this, opts);
}

WeChatAPI.prototype = new API();
WeChatAPI.prototype.constructor = WeChatAPI;


module.exports = WeChatAPI;