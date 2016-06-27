// 考虑是否可以覆盖这些方法
// 考虑函数被借用的时候要不要做些限制
var util = {
	// 是否是对象
	isObject: function (obj) {
		return obj != null && typeof obj === 'object';
	},
	// 是否是空串
	isEmptyStr: function (str) {
		return typeof str === 'string' && !str.length;
	},
	// 是否是null
	isNull: function (obj) {
		return obj === null;
	},
	// 是否是null或undefined
	isNullOrUndefined: function (obj) {
		return obj == null;
	},
	// 是否是undefined
	isUndefined: function (obj) {
		return obj === undefined;
	},
	// 是否是空串或null或undefined
	isNullStrOrNull: function (str) {
		return util.isEmptyStr(str) || str == null;
	},
	// 是否是对象或null或undefined
	isObjectOrNull: function (obj) {
		return obj === undefined || typeof obj === 'object';
	},
	isFunction: function (obj) {
		return typeof obj === 'function';
	},
	base64Encode: function (data) {
		return new Buffer(data)
			.toString('base64');
	},
	base64DecodeToString: function (str, charset) {
		charset = charset || 'utf8';
		return new Buffer(str, 'base64')
			.toString(charset);
	},
	base64Decode: function (str) {
		return new Buffer(str, 'base64');
	}
};

module.exports = util;