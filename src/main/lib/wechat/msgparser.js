const util = require('../../common/util');
const Message = require('./message');

function parseSubscribeEvent(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '感谢关注~让我来给你念两句诗'
	};
	return new Message(data);
}

function parseUnsubscribeEvent(msg) {
	//todo
}

function parseScanEvent(msg) {
	//todo
}

function parseLocationEvent(msg) {
	//todo
}

function parseClickEvent(msg) {
	//todo
}

function parseViewEvent(msg) {
	//todo
}

function parseTextMsg(msg) {
	//todo
}

function parseImageMsg(msg) {
	//todo
}

function parseVoiceMsg(msg) {
	//todo
}

function parseVideoMsg(msg) {
	//todo
}

function parseShortVideoMsg(msg) {
	//todo
}

function parseLocationMsg(msg) {
	//todo
}

function parseLinkMsg(msg) {
	//todo
}

function parseEventMsg(msg) {
	switch (msg.event) {
		case Message.EVENT_SUBSCRIBE:
			return parseSubscribeEvent(msg);
		case Message.EVENT_UNSUBSCRIBE:
			return parseUnsubscribeEvent(msg);
		case Message.EVENT_SCAN:
			return parseScanEvent(msg);
		case Message.EVENT_LOCATION:
			return parseLocationEvent(msg);
		case Message.EVENT_CLICK:
			return parseClickEvent(msg);
		case Message.EVENT_VIEW:
			return parseViewEvent(msg);
		default:
			break;
	}
}



function MsgParser() {
	var self = this instanceof MsgParser ? this : Object.create(MsgParser.prototype);
	if (!util.isFunction(self.parse)) {
		MsgParser.prototype.parse = MsgParser.parse;
	}
	return self;
}


MsgParser.parse = function (msg) {
	switch (msg.msgType) {
		case Message.TYPE_TEXT:
			return parseTextMsg(msg);
		case Message.TYPE_IMAGE:
			return parseImageMsg(msg);
		case Message.TYPE_VOICE:
			return parseVoiceMsg(msg);
		case Message.TYPE_VIDEO:
			return parseVideoMsg(msg);
		case Message.TYPE_SHORT_VIDEO:
			return parseShortVideoMsg(msg);
		case Message.TYPE_LOCATION:
			return parseLocationMsg(msg);
		case Message.TYPE_LINK:
			return parseLinkMsg(msg);
		case Message.TYPE_EVENT:
			return parseEventMsg(msg);
		default:
			//log error
			break;
	}
};

module.exports = MsgParser;