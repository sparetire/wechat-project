const util = require('../../common/util');
const XmlParser = require('./xmlparser');
const security = require('../../common/wechat/security');
const checkMsgSignature = security.checkMsgSignature;
const dencryptMsg = security.dencryptMsg;

// xml解析器，用来解析和生成微信消息的xml，
// 具有toXml(obj)和parseXml(xmlString)两个方法
var xmlParser = new XmlParser();

// 接受一个对象产生，返回布尔值，
// 校验对象是否是一个合法的微信消息对象
function isValidMsg(obj) {
	if (!util.isObject(obj)) {
		return false;
	}
	if (obj.toUserName && obj.fromUserName && obj.createTime && obj.msgType) {
		return true;
	}
	return false;
}


// 微信消息类，具有类方法parseXml(xmlString)，
// 消息对象具有toXml()方法，
// 构造方法接受一个普通对象用来将其转换为一个Message类对象
function Message(obj) {
	var self = this instanceof Message ? this : Object.create(Message.prototype);
	if (!isValidMsg(obj)) {
		throw new Error(
			'Parameter for constructor of Message is an invalid wechat message.');
	}


	for (var key in obj) {
		self[key] = obj[key];
	}

	if (!util.isFunction(self.toXml)) {
		// 将自身转换为XML字符串
		// 返回xml字符串
		// 可能抛出异常，需要被捕获
		Message.prototype.toXml = function () {
			// todo
			return xmlParser.toXml(this);
		};
	}


	return self;
}


// 将一个xml字符串转换为Message对象，
// 返回一个Promise传入Message对象
// 可能抛出异常，需要被捕获
// 如果是加密消息，则需要一个查询字符串对象
Message.parseXml = function (xml, query) {
	/* global logger, wechatInfo */
	return xmlParser.parseXml(xml)
		.then((data) => {
			// 对加密消息进行解密
			if (wechatInfo.msgEncrypt && data.encrypt && query.msg_signature && query.nonce &&
				query.timestamp) {
				// 检查消息签名
				if (checkMsgSignature(wechatInfo.token, query, data.encrypt)) {
					// todo
					data = dencryptMsg(data.encrypt);
					return new Message(data);
				} else {
					throw new Error(`Invalid message:\n${data}`);
				}
				// 明文消息
			} else {
				return new Message(data);
			}
		}, (err) => {
			logger.error(`An error occured when parsing xml.\n${err.stack}`);
			logger.error(err.stack);
			return err;
		});
};



Message.TYPE_TEXT = 'text';
Message.TYPE_IMAGE = 'image';
Message.TYPE_VOICE = 'voice';
Message.TYPE_VIDEO = 'video';
Message.TYPE_SHORT_VIDEO = 'shortvideo';
Message.TYPE_LOCATION = 'location';
Message.TYPE_LINK = 'link';
Message.TYPE_EVENT = 'event';
Message.TYPE_MUSIC = 'music';
Message.TYPE_NEWS = 'news';
Message.EVENT_SUBSCRIBE = 'subscribe';
Message.EVENT_UNSUBSCRIBE = 'unsubscribe';
Message.EVENT_SCAN = 'SCAN';
Message.EVENT_LOCATION = 'LOCATION';
Message.EVENT_CLICK = 'CLICK';
Message.EVENT_VIEW = 'VIEW';

module.exports = Message;