var APIObject = require('./apiobject');
var util = require('./util');


var API = (function () {
	var instance = null,
		flag = true;

	// 支持多个配置文件
	function API(config) {
		if (!util.isObject(config)) {
			throw new Error('Config must be an object.');
		}

		if (flag) {
			throw new Error('Can\'t ues this constructor to get an instance of API.');
		}

		var self = this instanceof API ? this : Object.create(API.prototype);

		for (var index in arguments) {
			if (util.isObject(arguments[index])) {
				for (var key in arguments[index]) {
					var api = arguments[index][key];
					self[key] = new APIObject(APIObject.parse(api));
				}
			}
		}
		flag = true;

		return self;
	}


	API.getInstance = function (config) {
		if (!instance) {
			flag = false;
			instance = new API(config);
			API.prototype.instance = instance;
			Object.defineProperty(API.prototype, 'instance', {
				configurable: false,
				enumerable: false,
				writable: false
			});
		}
		return instance;
	};


	return API;
})();



module.exports = API;