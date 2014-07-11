# grunt-mock2easy

> mock接口，生成md文档

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
grunt.initConfig({mock2easy: {
       port:3100,
       database:'mock2easy',
       doc:'doc'
   },
});
```

### Options

#### options.port
Type: `String`
Default value: 3100

启动的服务的端口号，保证端口不冲突即可.

#### options.database
Type: `String`
Default value: `mock2easy`

接口数据的生成位置

#### options.doc
Type: `String`
Default value: `doc`

接口文档的生成位置


## Release History

