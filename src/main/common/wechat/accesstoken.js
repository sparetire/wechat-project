// AccessToken应当是全局共享的，所以用单例
// AccessToken类的实例在初始化的时候应当读取数据库，根据读到的时间与当前时间对比，看是否过期，如果过期就重新获取并保存
// 所以AccessToken类应当具有一个getInstance方法用来获取/初始化单个实例
// 实例应当暴露一个accessToken和一个expiresIn的属性，属性只读不可修改，但不能这样，因为AccessToken是需要更新的，所以应当暴露一个getter方法，而setter方法就不暴露了，因为更新AccessToken只应当允许它自己进行更新，不应当允许其他模块/业务逻辑来更新AccessToken
// 这里其实也可以不用实例化token类而只用私有类变量来做，但考虑到更新AccessToken需要传入一个数据库对象，还是需要一个实例
// getter方法应当在拿当前实例的expiresIn值和当前时间进行对比，如果没有超时则直接返回，如果超时，则请求接口并更新属性，再写入数据库
// 到此，AccessToken类应当具有如下方法


// 属性
// accessToken 私有
// expiresIn 私有
// dataHolder 数据持久化对象，私有


// 构造方法
// AccessToken(apiObj, dataHolder) dataHolder是一个持久化对象，
// 具有一个save方法，save方法接受一个js对象，包含AccessToken的基本信息，
// save是一个更新或保存的操作，支持回调或promise，
// 还具有一个find方法，参数是mongodb的find方法的参数，支持回调或promise
// 持久化对象可以是一个数据库连接，也可以是一个文件，只要它实现了这个save方法，
// save方法相当于一个接口，构造方法不允许其他人调用，只允许getInstance调用

// getInstance(obj,[callback]) 将obj传给构造方法，实例化一个AccessToken对象，类方法，暴露

// getAccessToken([callback]) 取得一个最新的AccessToken包含access_token和expires_in字段，
// 可能会调用updateAccessToken和saveAccessToken，支持回调或Promise，暴露

// isExpired() 判断accessToken是否过期，暴露

// updateAccessToken([callback]) 请求接口更新AccessToken，
// 传给callback或者下一个Promise一个包含accessToken和expiresIn的对象和一个err，
// 如果请求失败要reject一个error
// 支持回调或Promise，私有

// queryAccessToken([callback]) 查询数据库取得AccessToken，
// 传给callback或者下一个Promise一个包含accessToken和expiresIn的对象和一个err，
// 如果查询失败要reject一个error，支持回调或Promise，私有

// saveAccessToken([callback]) 通过dataHolder将AccessToken写入数据库，
// 传给callback或者下一个Promise一个err，
// 如果写入失败要reject一个error
// 支持回调或Promise，私有，只有等updateAccessToken成功执行完后才会被调用

// 以上的callback都有一个err和一个data参数，data应当是一个对象的拷贝而不是对象的引用，避免被修改

// var acToken = AccessToken.getInstance(dbconn);
// var token = acToken.getAccessToken();
// var expiresIn = acToken.getExpiresIn();
// .....

// AccessToken.getInstance(dbconn).then((instance)=>{
// 	return instance.getAccessToken();
// }).then((token)=>{
// 	return token.getAccessToken();
// });


const util = require('../util');
const Promise = require('bluebird');

const AccessToken = (function () {
	var instance = null,
		flag = true;

	function AccessToken(apiObject, dataHolder) {
		if (flag) {
			throw new Error(
				'Can\'t use this constructor to get an instance of AccessToken.');
		} else if (!util.isObject(dataHolder) || !util.isFunction(dataHolder.save)) {
			throw new Error(
				'Dataholder must be an object which implements a save method.');
		} else if (!util.isObject(apiObject || !util.isFunction(apiObject.get))) {
			throw new Error(
				'ApiObject must be an object which implements a get method.');
		}

		// private
		var accessToken = null,
			expiresIn = null;

		// private
		function updateAccessToken(callback) {
			if (util.isFunction(callback)) {
				apiObject.get()
					.then((args) => {
						var body = args[2];
						accessToken = body.access_token;
						expiresIn = body.expires_in;
						var data = {
							accessToken: accessToken,
							expiresIn: expiresIn
						};
						callback(null, data);
					}, (args) => {
						var body = args[2],
							err = args[0];
						callback(err, body);
					});
			} else {
				return apiObject.get()
					.then((args) => {
						var body = args[2];
						accessToken = body.access_token;
						expiresIn = body.expires_in;
						return {
							accessToken: accessToken,
							expiresIn: expiresIn
						};
					}, (args) => {
						var err = args[0];
						return err;
					});
			}
		}

		// private
		function queryAccessToken(callback) {
			if (util.isFunction(callback)) {
				dataHolder.find()
					.then((data) => {
						callback(null, data);
					}, (err) => {
						callback(err, null);
					});
			} else {
				return dataHolder.find()
					.then((data) => {
						return data;
					}, (err) => {
						console.error('An error occured when finding accessToken: ' + err);
					});
			}
		}

		// private
		function saveAccessToken(callback) {
			if (util.isFunction(callback)) {
				dataHolder.save({
						accessToken: accessToken,
						expiresIn: expiresIn
					})
					.then((data) => {
						callback(null, data);
					}, (err) => {
						callback(err, null);
					});
			} else {
				return dataHolder.save({
						accessToken: accessToken,
						expiresIn: expiresIn
					})
					.then((data) => {
						return data;
					}, (err) => {
						console.error('An error occured when saving accessToken: ' + err);
						return err;
					});
			}
		}



		var self = this instanceof AccessToken ? this : Object.create(AccessToken.prototype);

		// public
		self.isExpired = function () {
			var currentTime = new Date()
				.getTime() / 1000;
			return expiresIn + 7000 < currentTime;
		};

		// public
		self.getAccessToken = function (callback) {
			// 没过期
			if (!this.isExpired()) {
				// 回调
				if (util.isFunction(callback)) {
					callback(null, accessToken);
					// Promise
				} else {
					return Promise.resolve(accessToken);
				}
				// 过期
			} else {
				// 回调
				if (util.isFunction(callback)) {
					updateAccessToken()
						.then((acToken) => {
							callback(null, accessToken);
							// 保持操作需要等update执行完，但不需要等callback执行完
							saveAccessToken()
								.catch((err) => {
									console.error('Save accessToken error: ' + err);
								});
						}, (err) => {
							callback(err, null);
						});

					// Promise
				} else {
					return updateAccessToken()
						.then((acToken) => {
							// 保持操作需要等update执行完，但不需要等callback执行完
							saveAccessToken()
								.catch((err) => {
									console.error('Save accessToken error: ' + err);
								});
							return acToken;
						}, (err) => {
							console.error('Request accessToken error: ' + err);
							return err;
						});

				}
			}
		};


		queryAccessToken()
			.then((data) => {
				accessToken = data.accessToken;
				expiresIn = data.expiresIn;
				if (self.isExpired()) {
					return updateAccessToken()
						.then((data) => {
							return saveAccessToken();
						});
				}
			});

		flag = true;

		return self;
	}


	AccessToken.getInstance = function (apiObject, dataHolder) {
		if (!instance) {
			flag = false;
			instance = new AccessToken(apiObject, dataHolder);
		}
		return instance;
	};

	return AccessToken;
})();