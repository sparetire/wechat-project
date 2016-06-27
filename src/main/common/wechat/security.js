const util = require('../util');
const sha1 = require('sha1');
const crypto = require('crypto');
/* global logger, wechatInfo */


function getMsgSignature(token, timestamp, nonce, msgEncrypt) {
	return sha1([token, timestamp, nonce, msgEncrypt].sort()
		.join(''));
}

function getSignature(token, timestamp, nonce) {
	return sha1([token, timestamp, nonce].sort()
		.join(''));
}


function checkSignature(token, query) {
	if (!util.isObject(query) || typeof token !== 'string') {
		logger.error('Parameter query is not an object or token is not a string.');
		return false;
	} else if (!query.signature || !query.timestamp || !query.nonce) {
		return false;
	}
	var signature = query.signature;
	var timestamp = query.timestamp;
	var nonce = query.nonce;
	if (getSignature(token, timestamp, nonce) === signature) {
		return true;
	} else {
		return false;
	}

}

function checkMsgSignature(token, query, msgEncrypt) {
	if (!util.isObject(query) || typeof token !== 'string') {
		logger.error('Parameter query is not an object or token is not a string.');
		return false;
	}
	var signature = query.msg_signature;
	var timestamp = query.timestamp;
	var nonce = query.nonce;
	if (getMsgSignature(token, timestamp, nonce, msgEncrypt) === signature) {
		return true;
	} else {
		return false;
	}

}

function encryptMsg() {
	//todo
}

function dencryptMsg(msg) {
	//todo
	var aesMsg = util.base64Decode(msg);
	var aesKey = util.base64Decode(wechatInfo.encodingAESKey + '=');
	var decipher = crypto.createDecipher('aes-256-cbc', aesKey);
	var raw = decipher.update(aesMsg);
}



module.exports = {
	checkMsgSignature: checkMsgSignature,
	checkSignature: checkSignature,
	getMsgSignature: getMsgSignature,
	getSignature: getSignature,
	encryptMsg: encryptMsg,
	dencryptMsg: dencryptMsg
};