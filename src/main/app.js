const koa = require('koa');
const sha1 = require('sha1');
const autoReply = require('./middleware/autoreply');
const init = require('./common/initapp');
const checkSign = require('./middleware/checksign');

const app = new koa();

init(app);

app.use(checkSign());
app.use(autoReply());

/* global logger */
app.on('error', (err) => {
	logger.error(`Unexcepted error:\n${err.stack}`);
});


app.listen(80);