var koa = require('koa');
var sha1 = require('sha1');

const app = new koa();

var wechatConfig = {
	TOKEN: ''
};

function checkSignature(config, query) {
	//config最好判断是Config类的实例
	if (typeof query !== 'object' || typeof config !== 'object') {
		console.error('The parameter query or config is not an object');
		return false;
	}
	var signature = query.signature;
	var timestamp = query.timestamp;
	var nonce = query.nonce;
	var token = config.TOKEN;
	var tmpStr = [token, timestamp, nonce].sort()
		.join('');
	if (sha1(tmpStr) === signature) {
		return true;
	} else {
		console.log('token:' + token + '\ntimestamp:' + timestamp + '\nnonce:' +
			nonce + '\nsignature:' + signature + '\nsha1:' + sha1(tmpStr));
		return false;
	}
}

app.use(function* () {
	if (checkSignature(wechatConfig, this.query)) {
		this.body = this.query.echostr;
		console.log('BODY IS: ' + this.body);
	} else {
		this.body = 'It looks something wrong.';
		console.log('BODY IS: ' + this.body);
	}
});

app.listen(80);