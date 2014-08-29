// 第一步：安装 casper  npm install -g casperjs
// 第二步： 以下完成自己的爬虫代码

//## 登录的地址
var loginUrl = '';
//## 登录成功后的地址
var mainUrl = '';

var utils = require('utils');

var page = require('casper').create({
	verbose: true,
	logLevel: 'error',
	pageSettings: {
	  loadImages:  false,
      loadPlugins: false,
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; rv:17.0) Gecko/20100101 Firefox/17.0'
	}
});

page.start(loginUrl,function(){

//## 写入登录操作
//API文档地址：http://docs.casperjs.org/en/latest/modules/index.html

//---------------------demo-------------------
//  this.page.switchToChildFrame(0);
//  this.fillXPath("#login-form", {
//    '//*[@id="fm-login-id"]': 'test_wg@qq.com',
//    '//*[@id="fm-login-password"]': 'cdef123456'
//  }, false);
//  this.click('#fm-login-submit');


});

page.waitFor(
	function check() {
		return this.getCurrentUrl().indexOf(mainUrl) > -1;
	}, function then() {
        var data,secToken;

        page.start( mainUrl, function() {
            var method = page.cli.get('method');
            var url = page.cli.get('url');
            var params = {};
            if(method === 'POST'){
                params = JSON.parse(page.cli.get('params'));

                //根据 window.Test.SEC_TOKEN 获取tocken

                params.token = this.getGlobal('Test').SEC_TOKEN;
            }else{
                 params = JSON.parse(page.cli.get('params'));

                url += '?';
                for(var i in params){
                   url += i + '=' + params[i] + '&';
                }
            }

            data = this.evaluate(function(url,method,params) {
                return JSON.parse(__utils__.sendAJAX(url, method, params, false));
            },{
                url: url,
                method: method,
                params:params
            });
        });

        page.then(function() {
            utils.dump(data);
        });
	}
);

page.run();



