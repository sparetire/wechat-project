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
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseScanEvent(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseLocationEvent(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseClickEvent(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseViewEvent(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseTextMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseImageMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseVoiceMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseVideoMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseShortVideoMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseLocationMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
}

function parseLinkMsg(msg) {
	//todo
	var currentTime = (new Date())
		.getTime();
	currentTime = Math.floor(currentTime / 1000);
	var data = {
		toUserName: msg.fromUserName,
		fromUserName: msg.toUserName,
		createTime: currentTime,
		msgType: Message.TYPE_TEXT,
		content: '蛤？'
	};
	return new Message(data);
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


function MsgCache() {
	var self = this instanceof MsgCache ? this : Object.create(MsgCache.prototype);
	var cache = {};

	if (!util.isFunction(self.addMsg)) {
		MsgCache.prototype.addMsg = function (id) {
			cache[id] = 1;
			setTimeout(() => {
				delete cache[id];
			}, 30000);
		};
	}

	if (!util.isFunction(self.hasMsg)) {
		MsgCache.prototype.hasMsg = function (id) {
			return cache.hasOwnProperty(id);
		};
	}


	return self;
}

var msgCache = new MsgCache();


function MsgParser() {
	var self = this instanceof MsgParser ? this : Object.create(MsgParser.prototype);
	if (!util.isFunction(self.parse)) {
		MsgParser.prototype.parse = MsgParser.parse;
	}
	return self;
}


MsgParser.parse = function (msg) {
	/* global logger */
	// 消息去重
	if (msg.msgId) {
		if (msgCache.hasMsg(msg.msgId)) {
			var currentTime = (new Date())
				.getTime();
			currentTime = Math.floor(currentTime / 1000);
			var data = {
				toUserName: msg.fromUserName,
				fromUserName: msg.toUserName,
				createTime: currentTime,
				msgType: Message.TYPE_TEXT,
				content: ''
			};
			return new Message(data);
		} else {
			msgCache.addMsg(msg.msgId);
		}
	}



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
			logger.error(`Invalid message:\n${msg.toXml()}`);
			break;
	}
};

module.exports = MsgParser;