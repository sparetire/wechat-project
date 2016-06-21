const DBFactory = require('./mongodbfactory');
const util = require('./util');

const MongoDB = (function () {
	var instance = null,
		flag = true;

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
			}
		}


		flag = true;
		return self;
	}


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
// 		console.log(data);
// 	});

module.exports = MongoDB;