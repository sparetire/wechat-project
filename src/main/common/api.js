var APIObject = require('./apiobject');
var util = require('./util');


// var API = (function () {
// 	var instance = null,
// 		flag = true;

// 	// 支持多个配置文件
// 	function API(config) {
// 		if (!util.isObject(config)) {
// 			throw new Error('Config must be an object.');
// 		}

// 		if (flag) {
// 			throw new Error('Can\'t ues this constructor to get an instance of API.');
// 		}

// 		var self = this instanceof API ? this : Object.create(API.prototype);

// 		for (var index in arguments) {
// 			if (util.isObject(arguments[index])) {
// 				for (var key in arguments[index]) {
// 					var api = arguments[index][key];
// 					self[key] = new APIObject(APIObject.parse(api));
// 				}
// 			}
// 		}
// 		flag = true;

// 		return self;
// 	}


// 	API.getInstance = function (config) {
// 		if (!instance) {
// 			flag = false;
// 			instance = new API(config);
// 			API.prototype.instance = instance;
// 			Object.defineProperty(API.prototype, 'instance', {
// 				configurable: false,
// 				enumerable: false,
// 				writable: false
// 			});
// 		}
// 		return instance;
// 	};


// 	return API;
// })();

// 支持多个配置文件作为配置项
// 如果是单例且不暴露setter方法设置配置项
// 就只能在第一次实例化就输入配置项
// 这会导致继承的子类也无法设置配置项
// 所以这里不用单例也不让配置项作为必需参数
// 可以被继承，子类作为某一业务逻辑的API对象
// 如可以有微信API对象，地图API对象
function API(config) {
	var self = this instanceof API ? this : Object.create(API.prototype);

	if (util.isNullOrUndefined(config)) {
		return self;
	}

	for (var index in arguments) {
		if (util.isObject(arguments[index])) {
			for (var key in arguments[index]) {
				if (key != 'defaultHost') {
					var api = arguments[index][key];
					self[key] = new APIObject(APIObject.parse(api, config.defaultHost));
				}
			}
		}
	}

	return self;
}

module.exports = API;
