const sha1 = require('sha1');
const util = require('../common/util');

/* global logger */
function checkSignature(token, query) {
	if (!util.isObject(query) || typeof token !== 'string') {
		logger.error('Parameter query is not an object or token is not a string.');
		return false;
	} else if (!query.signature || !query.timestamp || !query.nonce || !query.echostr) {
		return false;
	}
	var signature = query.signature;
	var timestamp = query.timestamp;
	var nonce = query.nonce;
	var tmpStr = [token, timestamp, nonce].sort()
		.join('');
	if (sha1(tmpStr) === signature) {
		return true;
	} else {
		return false;
	}

}

function checkSign(opts) {
	return function* parseSignature(next) {
		/* global wechatInfo */
		var ctx = this;
		console.log(ctx.url);
		if (ctx.method === 'POST') {
			yield next;
			return;
		}
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