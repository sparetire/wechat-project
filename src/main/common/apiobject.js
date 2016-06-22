// 处理单个对象的方法，将对象的method统一转大写，*
// 判断是否有POST方法带查询字符串的，决定是否忽略查询字符串，*
// 对没有href的对象，进行拼接url，*
// 确保对象不为null，在没有配置默认主机的情况下确保对象至少有协议头，主机
// 如果没有主机，用默认主机 *
// 默认主机host可以配置 *
// 最终得到URL, type和method *

// 为每个对象生成一个请求方法，请求方法是Promise *
// 请求方法根据对象的method决定接受的参数 *
// POST方法接受字符串，对象，Form对象，对象都会被序列化，对象的方法会被去掉 *
// GET方法接受字符串，字符串被作为查询字符串拼接到URL，对象，对象的方法会被去掉，对象被序列化成查询字符串 *

const util = require('./util');
const request = require('request');
const Promise = require('bluebird');
const QueryString = require('querystring');
const URL = require('url');


// 接受一个对象，带有url，method，restful和type属性，method，restful和type为可选，默认GET和JSON
// 暴露属性url，method，type，restful，都是只读，restful的值有true,false
// method的值有"GET"，"POST"，"ALL"，type的值有"JSON"，"FORM"，
// 暴露方法get和post，都接受三个参数，
// 一个请求参数options，options可以是对象也可以是字符串，
// 对于get，options是可选的，如果是字符串则作为查询字符串，如果是对象则被序列化成查询字符串，
// 对于post，options是必需的，如果是字符串，则作为body，如果是对象，则根据type的值被序列化成json或者form字符串，默认json，
// 一个标记flag，可选，默认false，如果为true，则options必填，options作为http的配置对象，其中method和url会被忽略
// 一个回调函数callback，可选，callback有三个参数，err，resp，body，同request库的callback，如果不传入callback，则get或post是promise函数
function APIObject(opts) {
	var self = this instanceof APIObject ? this : Object.create(APIObject.prototype);
	if (!util.isObjectOrNull(opts)) {
		throw new Error('Options must be an object or null.');
	}

	// 粗略判断下,就不用正则匹配确定URL格式了
	// 在构造函数里进行这么多判断好像不是很好，考虑改下
	if (util.isObject(opts)) {
		self.url = typeof opts.url === 'string' ? opts.url : '';
		self.method = typeof opts.method === 'string' ? opts.method.toUpperCase() :
			APIObject.GET;
		var temp = URL.parse(self.url);
		// 忽略POST方法的url的查询字符串
		if (self.method === APIObject.POST && !util.isNullStrOrNull(temp.search)) {
			self.url = self.url.slice(0, self.url.indexOf('?'));
		}
		// 为POST设置默认body类型为json
		if (self.method === APIObject.POST) {
			if (util.isNullOrUndefined(opts.type)) {
				opts.type = APIObject.JSON;
			} else if (typeof opts.type === 'string') {
				opts.type = opts.type.toUpperCase();
			}
			if (opts.type != null && opts.type != APIObject.JSON && opts.type !=
				APIObject.FORM) {
				throw new Error('Unkown property value: ' + opts.type +
					'. Type must be JSON or FORM.');
			}
			self.type = opts.type ? opts.type : APIObject.JSON;
		}
		// 为GET设置默认restful为false
		if (self.method === APIObject.GET) {
			if (util.isNullOrUndefined(opts.restful)) {
				self.restful = APIObject.NO_REST;
			} else if (typeof opts.restful != 'boolean') {
				throw new Error(
					'The type of property restful must be boolean, but get a value: ' + opts.restful
				);
			} else {
				self.restful = opts.restful;
			}
			// 对带有查询字符串的REST接口报错，这里和之前POST的处理有些不一致就是
			if (self.restful && self.url.indexOf('?') != -1) {
				throw new Error('An RESTFUL API can\'t have query string in URL.');
			}
		}
	} else {
		self.url = '';
		self.method = APIObject.GET;
	}



	// 生成请求方法,名字是get或post,支持回调也支持返回Promise
	// 接受一个配置对象，一个布尔值flag和一个回调函数callback
	// 如果flag为true，表明配置对象是包含http设置信息的
	// 否则对象只作为get post的请求参数
	// 如果对象只作为请求参数，对象会被序列化成get的查询字符串或者post的body
	// 如果对象是一个字符串，则作为get的查询字符串或者post的body
	// 如果存在callback参数，则请求函数不返回Promise
	// 否则返回一个Promise
	// 对于get方法，三个属性都是可选
	// post必须要有一个请求参数即body
	// APIObject的url,method,type应该是只读
	if (!util.isFunction(this.get)) {
		// 我一个喜欢装逼的人怎么会不用lambda表达式？因为这里有个坑。。
		APIObject.prototype.get = function () {
			if (this.method != APIObject.GET && this.method != APIObject.ALL) {
				throw new Error('This API only support GET method.');
			}
			var opts = null,
				callback = null,
				flag = null,
				requestURL = this.url;

			for (var key in arguments) {
				if (util.isFunction(arguments[key])) {
					callback = arguments[key];
				} else if (util.isObject(arguments[key]) || typeof arguments[key] ===
					'string') {
					opts = arguments[key];
				} else if (typeof arguments[key] === 'boolean') {
					flag = arguments[key];
				}
			}


			// 带参,是查询字符串
			if (typeof opts === 'string') {
				// url不能修改，不然对同一个api调用多次会导致url一直变长
				requestURL = this.url.indexOf('?') === -1 ? this.url + '?' + encodeURI(
						opts) :
					this.url + '&' + encodeURI(opts);
				// 带参,是restful api请求对象
			} else if (util.isObject(opts) && !flag && this.restful) {
				var reg = /{(\w+)}/g;
				requestURL = this.url.replace(reg, (m, v) => {
					if (util.isNullOrUndefined(opts[v])) {
						throw new Error('The parameter doesn\'t have an property named ' + v);
					}
					return opts[v];
				});
				// 带参,是请求参数对象不是http设置对象
			} else if (util.isObject(opts) && !flag) {
				requestURL = this.url.indexOf('?') === -1 ? this.url + QueryString.stringify(
					opts) : this.url + '&' + QueryString.stringify(opts);
			} else if (!util.isNullOrUndefined(opts)) {
				throw new Error('Please set right options.');
			}


			if (callback && !flag) {
				request(requestURL, callback);
			} else if (callback && flag && util.isObject(opts)) {
				opts.method = APIObject.GET;
				opts.url = requestURL;
				request(opts, callback);
			} else if (!callback && flag && util.isObject(opts)) {
				opts.method = APIObject.GET;
				opts.url = requestURL;
				return new Promise((resolve, reject) => {
					request(opts, function (err, resp, body) {
						var arr = Array.prototype.slice.call(arguments, 0);
						if (err) {
							reject(arr);
						} else {
							resolve(arr);
						}
					});
				});
			} else if (!callback && !flag) {
				var url = requestURL;
				return new Promise((resolve, reject) => {
					request(url, function (err, resp, body) {
						var arr = Array.prototype.slice.call(arguments, 0);
						if (err) {
							reject(arr);
						} else {
							resolve(arr);
						}
					});
				});
			}
		};
	}



	if (!util.isFunction(this.post)) {
		APIObject.prototype.post = function () {
			if (this.method != APIObject.POST && this.method != APIObject.ALL) {
				throw new Error('This API only support POST method.');
			}

			var opts = null,
				callback = null,
				flag = null;

			for (var key in arguments) {
				if (util.isFunction(arguments[key])) {
					callback = arguments[key];
				} else if (util.isObject(arguments[key]) || typeof arguments[key] ===
					'string') {
					opts = arguments[key];
				} else if (typeof arguments[key] === 'boolean') {
					flag = arguments[key];
				}
			}

			if (util.isNullOrUndefined(opts)) {
				throw new Error('POST method must hava a request body.');
			}

			var requestParam = {
				url: this.url,
				method: 'POST',
				json: true
			};

			// 带参,是查询字符串
			if (typeof opts === 'string' && opts.type === APIObject.FORM) {
				requestParam.json = false;
				requestParam.form = encodeURI(opts);
				// 带参,是请求参数对象不是http设置对象
			} else if (typeof opts === 'string' && opts.type === APIObject.JSON) {
				requestParam.body = JSON.parse(opts);
			} else if (util.isObject(opts) && opts.type === APIObject.JSON && !flag) {
				requestParam.body = opts;
			} else if (util.isObject(opts) && opts.type === APIObject.FORM && !flag) {
				requestParam.json = false;
				requestParam.form = QueryString.stringify(opts);
			} else if (!util.isNullOrUndefined(opts) && !flag) {
				throw new Error('Please set right options.');
			}



			if (callback && !flag) {
				request(requestParam, callback);
			} else if (callback && flag && util.isObject(opts)) {
				opts.method = APIObject.POST;
				opts.url = this.url;
				request(opts, callback);
			} else if (!callback && flag && util.isObject(opts)) {
				opts.method = APIObject.POST;
				opts.url = this.url;
				return new Promise((resolve, reject) => {
					request(opts, function (err, resp, body) {
						var arr = Array.prototype.slice.call(arguments, 0);
						if (err) {
							reject(arr);
						} else {
							resolve(arr);
						}
					});
				});
			} else if (!callback && !flag) {
				return new Promise((resolve, reject) => {
					request(requestParam, function (err, resp, body) {
						var arr = Array.prototype.slice.call(arguments, 0);
						if (err) {
							reject(arr);
						} else {
							resolve(arr);
						}
					});
				});
			}

		};
	}

	// 修改属性只读
	Object.defineProperties(self, {
		url: {
			configurable: false,
			writable: false
		},
		method: {
			configurable: false,
			writable: false
		},
		type: {
			configurable: false,
			writable: false
		},
		restful: {
			configurable: false,
			writable: false
		}
	});

	return self;
}

// 接受一个扩展到URL对象和一个默认host作为参数
// URL对象为必需，默认host为可选
// 函数会将一个URL对象进行处理得到一个url字符串
// 输出一个APIObject接受的对象
// 带有url，method和type三个属性
APIObject.parse = (opts, defaultHost) => {
	if (!util.isObject(opts)) {
		throw new Error('APIObject.parse expect an object, but get a parameter: ' +
			opts);
	}
	if (typeof defaultHost === 'string' && util.isNullStrOrNull(opts.href) &&
		util.isNullStrOrNull(opts.host) && util.isNullStrOrNull(opts.hostname)) {
		if (defaultHost.indexOf(':') != -1) {
			opts.protocol = typeof opts.protocol === 'string' ? opts.protocol : 'http:';
			opts.host = defaultHost;
		} else {
			opts.protocol = typeof opts.protocol === 'string' ? opts.protocol : 'http:';
			opts.hostname = defaultHost;
		}
	} else if (util.isNullStrOrNull(defaultHost) && util.isNullStrOrNull(opts.href) &&
		util.isNullStrOrNull(opts.host) && util.isNullStrOrNull(opts.hostname)) {
		throw new Error('You must set a host for api config.');
	}

	var apiObj = {
		url: '',
		method: opts.method,
		type: opts.type,
		restful: opts.restful
	};
	if (typeof opts.href === 'string') {
		apiObj.url = opts.href;
	}
	var url = URL.format(opts);
	apiObj.url = apiObj.url.length > url.length ? apiObj.url : url;

	return apiObj;
};

APIObject.GET = 'GET';
APIObject.POST = 'POST';
APIObject.ALL = 'ALL';
APIObject.JSON = 'JSON';
APIObject.FORM = 'FORM';
APIObject.NO_REST = false;

module.exports = APIObject;