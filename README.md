# grunt-mock2easy

> 通过nodejs的服务实现ajax的跨域访问，利用mockjs动态生成json接口，模拟各种恶略环境测试系统是否健全，测试接口生成接口文档

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
                keepAlive:true
            }
        }
   },
});
```

### Options

#### options.port

Type: `Number`

Default value: 3100

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



