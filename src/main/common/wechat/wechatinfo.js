const util = require('../util');
const WeChatInfo = (function () {
	// 作为类变量/静态变量防止暴露
	var instance = null,
		flag = true;


	function checkOptions(opts) {
		// 第一次获取实例必须设置Options
		//这里有个假设是只有没有实例的时候才会调用这个函数,不太好,但它是私有函数,就算了
		if (!util.isObject(opts)) {
			throw new Error('You didn\'t set options for WeChatInfo yet.');
		} else if (!opts.token) {
			console.warn('You didn\'t set token for WeChatInfo yet.');
		} else if (!opts.appid) {
			console.warn('You didn\'t set appid for WeChatInfo yet.');
		} else if (!opts.appSecret) {
			console.warn('You didn\'t set appSecret for WeChatInfo yet.');
		} else if (!opts.encodingAESKey) {
			console.warn('You didn\'t set encodingAESKey for WeChatInfo yet.');
		}
	}

	// 暴露属性token，appid，appSecret，encodingAESKey，都是只读，
	// 暴露方法getInstance，用来取得一个单例配置对象，第一次调用可以接受一个参数options对象，包含以上四个属性
	// 可能抛出异常
	function WeChatInfo(opts) {
		// 不排除以后会需要手动调用构造函数,还是留着
		if (!util.isObject(opts)) {
			throw new Error('Options must be an object.');
		}
		//与new无关的构造函数
		var self = this instanceof WeChatInfo ? this : Object.create(WeChatInfo
			.prototype);
		// 判断是否手动调用构造函数
		if (flag) {
			throw new Error(
				'Can\'t use this constructor to get an instance of WeChatInfo.');
		}
		if (!util.isNullOrUndefined(opts)) {
			self.token = typeof opts.token === 'string' ? opts.token : '';
			self.appid = typeof opts.appid === 'string' ? opts.appid : '';
			self.appSecret = typeof opts.appSecret === 'string' ? opts.appSecret : '';
			self.encodingAESKey = typeof opts.encodingAESKey === 'string' ? opts.encodingAESKey :
				'';
			self.username = typeof opts.username === 'string' ? opts.username : '';
			self.msgEncrypt = typeof opts.msgEncrypt === 'boolean' ? opts.msgEncrypt :
				false;
		} else {
			self.token = '';
			self.appid = '';
			self.appSecret = '';
			self.encodingAESKey = '';
			self.username = '';
			self.msgEncrypt = false;
		}

		Object.defineProperties(self, {
			token: {
				configurable: false,
				writable: false
			},
			appid: {
				configurable: false,
				writable: false
			},
			appSecret: {
				configurable: false,
				writable: false
			},
			encodingAESKey: {
				configurable: false,
				writable: false
			},
			username: {
				configurable: false,
				writable: false
			}
		});

		flag = true;
		return self;
	}

	WeChatInfo.getInstance = function (opts) {
		if (!instance) {
			flag = false;
			// Options的四个属性允许空但不建议这样
			checkOptions(opts);
			instance = new WeChatInfo(opts);
			// WeChatInfo.prototype.instance = instance;
			// 不可枚举且不可删除不可修改指向
			// Object.defineProperty(WeChatInfo.prototype, 'instance', {
			// 	configurable: false,
			// 	enumerable: false,
			// 	writable: false
			// });
		}
		return instance;
	};
	return WeChatInfo;
})();

module.exports = WeChatInfo;