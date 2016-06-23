const getRawBody = require('raw-body');
const Message = require('../lib/wechat/message');
const MsgParser = require('../lib/wechat/msgparser');


function autoReply(opts) {
	return function* reply(next) {
		var ctx = this;
		var body = yield getRawBody(ctx.req, {
			length: ctx.request.length,
			limit: '1mb',
			encoding: ctx.request.charset
		});

		var msg = yield Message.parseXml(body);
		var replyMsg = MsgParser.parse(msg);
		ctx.body = replyMsg.toXml();
	};
}

module.exports = autoReply;