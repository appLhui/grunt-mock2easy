# grunt-mock2easy

> 通过nodejs的服务实现ajax的跨域访问，使用Curl获取接口，利用mockjs动态生成json接口，支持jsonp格式，模拟多种服务器环境，测试接口并且生成接口文档

## Demo

click [grunt-mock2easy-demo](https://github.com/appLhui/grunt-mock2easy-demo) 


## 1. Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mock2easy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mock2easy');
```

##  2. The "mock2easy" task

### Overview
In your project's Gruntfile, add a section named `mock2easy` to the data object passed into `grunt.initConfig()`.


```js

// 访问本地静态mock数据
grunt.initConfig({
    mock2easy: {
        test:{
            options: {
                port:3000,
                lazyLoadTime:3000,  // 延时加载时间
                database:'database',
                doc:'doc',   
                keepAlive:true,  // 是否独立运行
                ignoreField:['__preventCache', 'secToken'],  // 默认忽略的接口入参
                interfaceSuffix:'.json' //默认生成为 .json 结尾的接口
            }
        }
   },
});

// 通过Curl访问服务端的接口数据（解决联调困难，所有接口自动进行跨域访问，如果是 windows系统，请先为系统安装 curl 命令）

 mock2easy: {
      test: {
        options: {
          port: 3000,
          lazyLoadTime:3000, 
          database: 'database',
          keepAlive: false,
          ignoreField: ['__preventCache', 'secToken'],
          interfaceSuffix:'.json' //默认生成为 .json 结尾的接口
          curl: {  // curl 这个参数如果配置了，就通过curl访问远程接口，不再访问本地接口
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

#### options.interfaceSuffix

Type: `Sting`

Default value:  `.json`
默认为`.json` ,产生的接口都是以`.json`为后缀的，若你的接口全部都是`.action`结尾的话，可以将该属性更改为`.action`。

#### options.ignoreField

Type: `Array`

Default value: []

默认为[]，可以添加忽略的请求参数，在每次发起请求的时候不去校验这些字段，例如：`__preventCache`等字段，可能不是我们想要的校验的参数。


## 3. 修改 grunt-contrib-connect 配置

通过 connect 的 middleware 参数将接口转发至 mock2easy 进行处理

修改 `Gruntfile.js` 中 connect的配置
```js
  
  // demo
  connect: {
     server: {
       options: {
         middleware:  function(connect) {
             return [
               require('./database/do')   // 引入数据接口生成文件中的do.js脚本
             ];
           },
       },
     },
   },

```




## mockjs的支持

文档生成默认在 `./doc/` 目录下，push 到 git 上可以直接查看

支持所有的mockjs语法，[Mockjs语法样例](http://mockjs.com/demo/mock.html) 

如果有好的建议和意见请联系我：lhui3it@gmail.com

[使用案例请戳我>>](https://github.com/appLhui/grunt-mock2easy-demo) 

## 基本界面

#### 主界面

1. 方面模拟访问延时状态，轻松检查 loading 状态是否合理处理。

2. 录制接口（类似 postman 操作），轻松通过 curl ( 保证系统支持curl命令 )访问远程接口，并将接口录制入本地接口库。

3. 访问本地接口库，自动检查接口是否存在异常，轻松保持本地接口库代码和 js 调用接口代码保持一致，并且确保接口文档实时和脚本保持一致。


![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/index.png) 

#### 接口操作页面

1. 动态接口，使用 [Mockjs](http://mockjs.com/demo/mock.html)  作为支持，可以动态随机生成接口。

2. 动态接口，可以轻松在任何一个节点上加上注释。

3. 静态接口，如果接口数据过于复杂，mock2easy  无法满足您的需求，请选用静态接口。

4. json 和 jsonp 互相切换

![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/detail.png) 

#### 接口文档

 [接口菜单>>](https://github.com/appLhui/grunt-mock2easy-demo/blob/master/doc/menu.md)

 
![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/md_menu.png) 

 [接口详情>>](https://github.com/appLhui/grunt-mock2easy-demo/blob/master/doc/demo/jsondemo.md)


![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/md_detail.png) 








