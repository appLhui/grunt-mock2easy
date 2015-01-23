# grunt-mock2easy

> 通过nodejs的服务实现ajax的跨域访问，使用Curl获取接口，利用mockjs动态生成json接口，模拟多种服务器环境，测试接口并且生成接口文档

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
            Cookie: '_yundun_session0=Jy%2BxkRm9JWrHB9%2B%2Bq84dcf4tLAUfECcVq5NknX2Rs9icrDXwM%2FLn1FtaLni4zz1CCR7Bjjml5YVcMWyGP7AT5dVNjGMzhtaCjj%2Fuibttm0YM7AuDX1YliZGAHcgmNLv9jLFsQtRHBKpF6CD7YvJrHZCJeH%2BEhIDY%2BW%2BtUPernE098GZncKtQnCmBhBZz2PTyBvVjqhGi909L7E6%2BgwtsHHU2sCzKxbAmWkPTqSua4CHdc1Im6379fy9%2F2o1dweWKMcjJ7km8OeHmJ%2Bc2rsug6U7nHzUStZdHp%2Ff%2FUdpw6GVzqVdzPSDkKzcfgcHm1fH%2BzN4BJt%2BOmDklLtSoeF%2Bj0fnSUuMn6lLDlENLXhvFE%2BxCYH2O%2Fhm1LlaVUL4PgXhZdoxr2hMx2pk2oHpyZ%2FU56ehZJMnOWAoqpFFHJe60Gh5aWOQo4W9VU8N0771wkQEmUJeKZj5wvvlX3txtbvRcIb8gP%2F7DfFJi%2Bvsv0%2BDZqScB63Dfv9Oy%2FbdWFuGAoPQ4o0aT3aDQUG0YfQmmZhk%2Bq0eUBsQmrTEgmpJ9ruj2fWYEE7njmviy1VU6DAHZHZClaJAgAC2mM7YsbNsNJlc5D2isxRFWFmOD4YOFg9GZqOPOqIf5FtEqVdO%2FB%2F%2BPt%2BoY4tb3j3X7wmbbcyrayEEYq%2B8CxrOIfQeiL4%2Fm5vah6RUgv8erxMGrFqzIbP67OSYd; tmp0=eNrz4A12DQ729PeL9%2FV3cfUxiKzOTLFSCvc1NTPzdTTUNTNzDAtxDolydg4M8PF1dfZ29Awz1PXwiPRwCTLy1PU2MlLSSS6xMjQxNDM1Mza3MDMzN9JJTEYTyK2wMqiNAgAa6BwW; www_aliyun=91op7m56qg057u3au4kuaa1t26; rds_console0=8Nd1CWJDB1afyx6qkvSFjZugN7WIFeSPVxBWkNTB8a5pYF2tFVA9WoRO5y%2FZnNDbF8srdK09h2LvQb5h4pAG85vDek9kZfnODz77%2B%2FHu1IAXBUq%2F91EVZd9CTpXqQQNdjWaIRbAhCAmDd%2BGdnYGdnf3BgWpI8F2S0s%2BNjL9OM%2BCMUPbT5h7NxyXOT1biqYu%2FnUUqJrzKrEutFnWruzgcaDupdsvEkowUZPcmNPhlxhoXxE5UPNZ0hvOZPAcPo2E8ILi8wyex7n%2F7E8cgrvjxt8gT8WwT4JXEF6WFLq8MhGnS10azF6Tu4Fd7oZ0kS3NQJRwAWySof8Z2kQ3EeLj19Q%3D%3D; 1218_pre=1path=/; lzstat_uv=27876607633702415311|3492025@3517224; lzstat_ss=2596847728_0_1417193591_3492025|2653732301_0_1418732304_3517224; ess_console0=nS3id7nckqCX4uLfWPkecP8Y0NrMMit8R1IrOeuttRhwI8yqxH3nt9JCV4a5EE%2FnFl5hhzdLqQJ13r3RFy2KTczr2xONcMjlVUrce%2F2RvWIfT6e8uMig2wjoGh6o%2BzGQmXbr0q1dYLhuOaCQkidkvof08nYcEs0vMh5a%2BPZHy2p8hF6BoqxVQZxaV0U9E7b3FP0BRzv5fGFoaJk5%2BdqrSoY7B%2FLKsJHN4FXYBBi8AcwFzYB6qBk6SNw%2FByJNkDYdEwDC63OOCCpHkhDseCvhuxaYLwoQbBMTunwKwb7%2BViw3SVsk5kjxq2gTgdGJhpHnFVfNiLEtb6GzIZ9%2FEKBpzQ%3D%3D; cna=JKvsDLxjsBUCASp4SlhOqnMb; JSESSIONID=YM566PB1-2L2WI0MMIIIR1WENHSDP1-Y81P635I-MU5; cdn_console0=1AbLByOMHeZe3G41KYd5WQUX6BcNCRw7mQqKmagGbL3P740%2F7fjgGWL2%2BpoOh%2FfMev9Q6pf%2FMR16xCBJ7BpVdZNvKJCq2ikORIDmFQJIeUagTudS4RObMqixxogYr4J20WPGkoQJ47cGzLv6QeTlXA%3D%3D; odps_console_spring110=eNrz4A12DQ729PeL9%2FV3cfUxiKzOTLFSCvU1NTMLdTLUdQm0CDIzDo%2FyNPXwCjQMcTMPCgw10vXzDvY1cYv00PU0NlLSSS6xMjQxMDc0NDM0MzYzNtJJTAYKGBmam5gamJgBKZ3cCiuD2igAExQb4w%3D%3D; _ga=GA1.2.1230126880.1416469573; oss_portal0=eNrz4A12DQ729PeL9%2FV3cfUxiKzOTLFSivQ1NTMLcDLUNfIxCvc08PX19PQMMgx39fMIdgkw1I20MAwwMzb11PUNNVXSSS6xMjQxMrQwtLAwNjIwMdFJTIYIGJmZGJgYmRro5FZYGdRGAQAG1Ruq; login_aliyunid="test_wg@aliyun.com"; login_aliyunid_ticket=qIZCr6t7SGxRigm2Cb4fGaCdBZWIzmgdHq6sXXZQg4KFWufyvpeV*0*Cm58slMT1tJw3_1$$ONVAof0ZgxrbP5U2a_ZSDRtqiUYTyleKhGAPVDRgniof_BNpwU_TOTNChZBoeM1KJexdfb9zhYnsN5so0; login_aliyunid_csrf=_csrf_tk_1036621828141418; hssid=18s4uTSyNOlleuyfyyUFDyA1; hsite=6; sls_console0=BPBdD07Tvdk1xD9U4NnzYce0r4vlVANWU%2BjdXpM1n9vg4Z6JEnkot0YfEvJltkklXUuD1D5TvbgvFelIhyYCFye69qjAdj%2BHJHimpN2BU4TSzlkXKMEWwD8FNw8LK4AddbDKMDhS04nU3DW7euVzhPFRtbc14DuLpnmbpfLuS%2FxYrtxhcb4pHfQgvp1QI0E8lPlhLRxJ88hkF6rlaTd%2BA7LZD8x2y6HVZoMxtLSV1HvRnWQtCeCgZEBXoLWSLogHQKi0mJnXo10%2B85lGPlcXh15TREz9hMCZCbUTpxHwnleUF4q9Jj3NivkdvVg8Nl%2BW8iHE1fhrANNcOMbOKRMxSQ%3D%3D; announcementJsonpCallToken=c270664e-18c0-458f-a0b8-580c8a44aa2d; console_user_localization=zh-cn; console0=3DG1Lf9XP8p4m1dYcJAmQi%2B28fGnjnTFHA623bqOi2sPm%2FII%2BoYOK7uMXdsEx16%2B%2FCZD7%2BlLBajmlLKxzzDS2xnW7iZVNGqyi0LoxZ9TLRtUrvYZisvBepHDCm1fpY1TlmuiNTyPTj5tfU1nAygQcVjcJCDWmbBVQe8dWAsClRptYkIcQ8vjn5oatGSmwuNpum%2BVBpgorLV7rWWQp9j8ubJf9gvyzO%2Fj2ycQviPvp6lk079pdtK813U6gCGA6NuQvukT%2Fgi6uQ9wWoo2Ek2OYCdHPD0N6pV1u13gSJFUJVvcig60PXi%2Fgg%2B9X8w0erTX15UREASkpzQNtuIvcz3cXKCOKxgzG5cZ0FygaMUu60E%3D; topbarJsonpCallToken=2f9129fd-c4a3-4da6-aef2-e13adef8097d; isg=23A4C308CA30495972CB62334BF56875; SERVERID=7dfbfe2f26f9fe65ac515beaa946daf0|1421836292|1421836267'
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

支持所有的mockjs语法，[Mockjs语法样例](http://mockjs.com/demo/mock.html) 

如果有好的建议和意见请联系我：lhui3it@gmail.com

## 基本界面

![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/index.png) 
![image](https://raw.githubusercontent.com/appLhui/grunt-mock2easy/master/img/detail.png) 






