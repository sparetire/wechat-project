const util = require('./util');
const co = require('co');
const URL = require('url');
const MongoClient = require('mongodb');
const QueryString = require('query-string');


// 接受一个字符串参数作为url，生成一个DB对象
function DBFactory(url) {
	if (typeof url != 'string') {
		throw new Error(`Constructor expect a string parameter, but get a: ${url}.`);
	}
	var db = -1,
		done = false;
	co(function* () {
			db = yield MongoClient.connect(url);
			done = true;
		})
		.catch(function (err) {
			console.error('An error occured when connecting to mongodb.');
			console.error(err.stack);
			// throw new Error(err);
		});
	// WTF, async to sync
	require('deasync')
		.loopWhile(() => !done);
	return db;
}


// 将一个数据库配置的配置对象和一个默认配置对象转化成数据库连接url，
// 返回url字符串，配置对象的优先级大于默认配置对象
DBFactory.parse = function (opts, dft) {
	if (!util.isObject(opts)) {
		throw new Error('Config must be an object.');
	}

	var conf = dft ? JSON.parse(JSON.stringify(dft)) : {};
	for (var key in opts) {
		conf[key] = opts[key];
	}

	if (!conf.username) {
		throw new Error('You must set a username.');
	} else if (!conf.password) {
		throw new Error('You must set a password.');
	} else if (!conf.host) {
		throw new Error('You must set a host.');
	} else if (!conf.port) {
		throw new Error('You must set a port.');
	} else if (!conf.dbName) {
		throw new Error('You must set a database name.');
	}

	var urlObj = {
		protocol: 'mongodb',
		slashes: true,
		auth: `${conf.username}:${conf.password}`,
		hostname: conf.host,
		port: conf.port,
		pathname: `/${conf.dbName}`
	};

	delete conf.username;
	delete conf.password;
	delete conf.host;
	delete conf.port;
	delete conf.dbName;

	var qs = QueryString.stringify(conf);
	var uri = URL.format(urlObj);

	if (util.isEmptyStr(qs)) {
		return uri;
	} else {
		return uri + '?' + qs;
	}

};


module.exports = DBFactory;