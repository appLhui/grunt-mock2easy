# grunt-mock2easy

> 通过nodejs的服务实现ajax的跨域访问，使用Curl获取接口，利用mockjs动态生成json接口，模拟多种服务器环境，测试接口并且生成接口文档

## Demo

click [grunt-mock2easy-demo](https://github.com/appLhui/grunt-mock2easy-demo) 


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install express@3.4.8   // 一定要注意express的版本
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

// 访问本地静态mock数据
grunt.initConfig({
    mock2easy: {
        test:{
            options: {
                port:3000,
                lazyLoadTime:3000,  
                database:'database',
                doc:'doc',   
                keepAlive:true,  // 是否独立运行
                ignoreField:[],  // 默认忽略的接口入参
            }
        }
   },
});

// 通过Curl访问服务端的接口数据

 mock2easy: {
      test: {
        options: {
          port: 3334,
          database: 'database',
          keepAlive: false,
          ignoreField: ['__preventCache', 'secToken'],
          curl: {
            domain: 'http://hello.console.demo.com',  // 域名
            parameter: {                           // 每次请求需要带的参数
              secToken: 'jimZPPU1MZtLmjFXnxCl22'
            },
            Cookie: 'kRm9JWrHB9%2B%2Bq84dcf4tLAUfECcVq5NknX2Rs9ic'
          }
        }
      }
    }

```

### Options

#### options.port

Type: `Number`

Default value: 3000

启动的服务的端口号 

#### options.lazyLoadTime

Type: `Number`

Default value: 3000

启动接口延时加载，调用接口的延迟时间 

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


#### options.curl

Type: `Object`

Default value: false

默认为不写，如果写了的话优先于Curl请求，所有的接口将不再访问本地的mock数据，改为通过Curl访问服务端的接口

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

文档生成默认在 `./doc/`,push 到 git 上可以直接查看

支持所有的mockjs语法，[Mockjs语法样例](http://mockjs.com/demo/mock.html) 

如果有好的建议和意见请联系我：lhui3it@gmail.com

[grunt-mock2easy-demo](https://github.com/appLhui/grunt-mock2easy-demo) 

## 基本界面

![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/index.png) 


![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/detail.png) 






