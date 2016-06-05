// 配置文件中每一项都是一个扩展的URL对象,多了一个method属性和一个type属性,
// 大小写随意,type的值有json和form
// method可以是GET，POST，ALL
// 带查询字符串的，但method为POST的，查询字符串会被忽略
// URL对象见https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
var wechatAPIs = {
	accessToken: {
		href: '',
		method: 'GET'
	}
};