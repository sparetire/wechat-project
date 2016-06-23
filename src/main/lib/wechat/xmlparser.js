const xml2js = require('xml2js');
const util = require('../../common/util');
const Promise = require('bluebird');
const heredoc = require('heredoc');
const ejs = require('ejs');

// 微信消息模板
var msgTemplate = heredoc(function () {
	/*
	<xml>
	<ToUserName><![CDATA[<%- toUserName %>]]></ToUserName>
	<FromUserName><![CDATA[<%- fromUserName %>]]></FromUserName>
	<CreateTime><%- createTime %></CreateTime>
	<MsgType><![CDATA[<%- msgType %>]]></MsgType>
	<% if (msgType === 'text') { %>
		<Content><![CDATA[<%- content %>]]></Content>
	<% } else if (msgType === 'image') { %>
		<Image>
			<MediaId><![CDATA[<%- mediaId %>]]></MediaId>
		</Image>
	<% } else if (msgType === 'voice') { %>
		<Voice>
			<MediaId><![CDATA[<%- mediaId %>]]></MediaId>
		</Voice>
	<% } else if (msgType === 'video') { %>
		<Video>
			<MediaId><![CDATA[<%- mediaId %>]]></MediaId>
			<% if (this.title) { %>
			<Title><![CDATA[<%- title %>]]></Title>
			<% } %>
			<% if (this.description) { %>
			<Description><![CDATA[<%- description %>]]></Description>
			<% } %>
		</Video> 
	<% } else if (msgType === 'music') { %>
		<Music>
			<% if (this.title) { %>
			<Title><![CDATA[<%- title %>]]></Title>
			<% } %>
			<% if (this.description) { %>
			<Description><![CDATA[<%- description %>]]></Description>
			<% } %>
			<% if (this.musicUrl) { %>
			<MusicUrl><![CDATA[<%- musicUrl %>]]></MusicUrl>
			<% } %>
			<% if (this.hqMusicUrl) { %>
			<HQMusicUrl><![CDATA[<%- hqMusicUrl %>]]></HQMusicUrl>
			<% } %>
			<% if (this.thumbMediaId) { %>
			<ThumbMediaId><![CDATA[<%- thumbMediaId %>]]></ThumbMediaId>
			<% } %>
		</Music>
	<% } else if (msgType === 'news') { %>
		<ArticleCount><%- articles.length %></ArticleCount>
		<Articles>
		<% articles.forEach(function (item) { %>
			<item>
			<% if (item.title) { %>
				<Title><![CDATA[<%- item.title %>]]></Title> 
			<% } %>
			<% if (item.description) { %>
				<Description><![CDATA[<%- item.description %>]]></Description>
			<% } %>
			<% if (item.picUrl) { %>
				<PicUrl><![CDATA[<%- item.picUrl %>]]></PicUrl>
			<% } %>
			<% if (item.url) { %>
				<Url><![CDATA[<%- item.url %>]]></Url>
			<% } %>
			</item>
		<% }) %>
		</Articles>
	<% } %>
	</xml>
	*/
});

// 接受一个对象，生成微信消息XML包，
// 格式参照微信消息XML，属性小驼峰命名，
// 对象缺少必填参数会抛出异常
var toXml = ejs.compile(msgTemplate);

// xml解析器，用来解析和生成微信消息的xml，
// 具有toXml(obj)和parseXml(xmlString)两个方法
function XmlParser() {
	var self = this instanceof XmlParser ? this : Object.create(XmlParser.prototype);

	if (!util.isFunction(self.parseXml)) {
		// 接受一个xml字符串，转换成一个对象，
		// 对象属性全是小驼峰命名值为字符串
		// 返回Promise，解析xml过程中可能会抛出异常
		XmlParser.prototype.parseXml = XmlParser.parseXml;
	}

	if (!util.isFunction(self.toXml)) {
		XmlParser.prototype.toXml = toXml;
	}

	return self;
}

XmlParser.parseXml = function (xml) {
	return new Promise(function (resolve, reject) {
		xml2js.parseString(xml, {
			trim: true,
			normalize: true
		}, (err, data) => {
			if (err) {
				reject(err);
			}

			var obj = data.xml;
			var newObj = {};
			for (var key in obj) {
				var newKey = key.slice(0, 1)
					.toLowerCase() + key.slice(1);
				newObj[newKey] = obj[key][0];
			}

			resolve(newObj);

		});
	});
};

XmlParser.toXml = toXml;


module.exports = XmlParser;