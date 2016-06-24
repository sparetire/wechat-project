const DBFactory = require('./mongodbfactory');
const util = require('./util');

/* global logger */

// 单例，读取一个数据库配置文件，
// 每个数据库连接对象都会被挂载到这个单例上，
// 数据库连接对象即MongoDB驱动的DB对象
const MongoDB = (function () {
	var instance = null,
		flag = true;

	// 可能抛出异常
	function MongoDB(config) {
		if (flag) {
			throw new Error(
				'Can\'t use this constructor to get an instance of MongoDB.');
		}

		if (!util.isObject(config)) {
			throw new Error('Config must be an object.');
		}

		var self = this instanceof MongoDB ? this : Object.create(MongoDB.prototype);

		for (var key in config) {
			if (key !== MongoDB.DEFAULT) {
				self[key] = DBFactory(DBFactory.parse(config[key], config[MongoDB.DEFAULT]));
				Object.defineProperty(self, key, {
					configurable: false,
					writable: false
				});
			}
		}

		self.close = function () {
			try {
				for (var key in this) {
					if (util.isFunction(this[key].close)) {
						this[key].close();
					}
				}
			} catch (err) {
				logger.error(
					`An error occured when closing database connection.\n${err.stack}`);
			}
		};


		flag = true;
		return self;
	}

	// 接受一个配置文件
	MongoDB.getInstance = function (config) {
		if (!instance) {
			flag = false;
			instance = new MongoDB(config);
		}

		return instance;
	};

	MongoDB.DEFAULT = 'default';


	return MongoDB;
})();


// var mconf = require('../conf/mongodbconf');
// var DBManager = MongoDB.getInstance(mconf);
// var db = DBManager.wechat;
// db.collection('config')
// 	.find()
// 	.limit(2)
// 	.toArray((err, data) => {
// 		logger.log(data);
// 	});

module.exports = MongoDB;