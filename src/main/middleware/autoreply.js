const getRawBody = require('raw-body');
const Message = require('../lib/wechat/message');
const MsgParser = require('../lib/wechat/msgparser');


function autoReply(opts) {
	/* global logger */
	return function* reply(next) {
		var ctx = this;

		if (ctx.method === 'GET') {
			yield next;
			return;
		}


		var body = yield getRawBody(ctx.req, {
			length: ctx.request.length,
			limit: '1mb',
			// encoding: ctx.request.charset
			encoding: 'utf8'
		});

		console.log(`GET: ${ctx.url}`);
		console.log(body);

		try {
			var msg = yield Message.parseXml(body);
		} catch (err) {
			logger.error(
				`Parsing xml error. Request from ${ctx.ip}. Request body is:\n ${body}`);
			ctx.body = '';
			return;
		}
		var replyMsg = MsgParser.parse(msg);
		ctx.body = replyMsg.toXml();
		yield next;
	};
}

module.exports = autoReply;