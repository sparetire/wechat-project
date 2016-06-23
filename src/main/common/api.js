const APIObject = require('./apiobject');
const util = require('./util');


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
				if (key != API.DEFAULT_HOST) {
					var api = arguments[index][key];
					self[key] = new APIObject(APIObject.parse(api, config[API.DEFAULT_HOST]));
				}
			}
		}
	}

	return self;
}

API.DEFAULT_HOST = 'defaultHost';

module.exports = API;