# grunt-mock2easy

> 通过nodejs的服务实现ajax的跨域访问，使用爬虫模拟登录获取接口，利用mockjs动态生成json接口，模拟多种服务器环境，测试接口并且生成接口文档

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mock2easy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mock2easy');
```

## The "mock2easy" task

### Overview
In your project's Gruntfile, add a section named `mock2easy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    mock2easy: {
        test:{
            options: {
                port:3000,
                database:'database',
                doc:'doc',
                keepAlive:true,
                isSpider:false,
                ignoreField:[]
            }
        }
   },
});
```

### Options

#### options.port

Type: `Number`

Default value: 3000

启动的服务的端口号  

#### options.database

Type: `String`

Default value: `mock2easy`

接口数据的生成位置

#### options.doc

Type: `String`

Default value: `doc`

接口文档的生成位置

#### options.keepAlive

Type: `Boolean`

Default value: true

默认为`true`，`true`时可以独立起一个服务提供接口，`false`时可以和别的grunt服务组合成为一个任务串


#### options.isSpider

Type: `Boolean`

Default value: false

默认为`false`，如果你的系统有很多的安全防护，不能使用改变IP和端口号来获取接口，请尝试这个方式。
这个参数为是否使用爬虫获取接口，使用这个配置需要本地装有 `casperjs`，如果没有请先运行 `sudo npm install -g casperjs`,请先运行一次`grunt-mock2easy`,然后在 /database（默认）目录下 编辑修改适合自己的app.js文件。

#### options.ignoreField

Type: `Array`

Default value: []

默认为[]，可以添加忽略的请求参数，例如：`__preventCache`等字段，可能不是我们想要的校验的参数


## grunt-contrib-connect 实现ajax请求跨域

修改 `Gruntfile.js` 中 connect的配置
```js
  
  connect: {
     server: {
       options: {
         middleware:  function(connect) {
             return [
               require('connect-livereload')(
                 {port: globalSetting.liveReloadPort}
               ),
               require('./database/do')   //引入数据接口生成文件中的do.js脚本
             ];
           },
       },
     },
   },

```

联调时只需要改变 `do.js` 中的  `hostname` 和 `port` 即可,



## mockjs的支持

支持所有的mockjs语法，[Mockjs语法样例](http://mockjs.com/demo/mock.html) 

如果有好的建议和意见请联系我：lhui3it@gmail.com

## 基本界面

![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/index.png) 
![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/detail.png) 





