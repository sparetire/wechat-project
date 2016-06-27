const security = require('../common/wechat/security');
const checkSignature = security.checkSignature;

/* global logger, wechatInfo */

function checkSign(opts) {
	return function* parseSignature(next) {
		var ctx = this;
		if (ctx.method === 'POST') {
			yield next;
			return;
		}
		console.log(`GET: ${ctx.url}`);
		if (checkSignature(wechatInfo.token, ctx.query)) {
			ctx.body = ctx.query.echostr;
		} else {
			ctx.body = 'Invalid request.';
			logger.error(`Invalid GET request from ${ctx.ip}: ${ctx.url}.`);
		}
		yield next;
	};
}

module.exports = checkSign;