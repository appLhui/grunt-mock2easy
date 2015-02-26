/**
 * Created by lihui on 15-2-26.
 */


module.exports = function(grunt,preferredLanguage){
   var languages = {
     'en':{},
     'cn':{
       'DELETE':'删除',
       'ADD':'添加',
       'OPTIONAL':'选填',
       'REQUIRED':'必填',
       'RECORD':'录制',
       'ERROR-ALREADY-EXISTS':'接口已经存在',
       'PARAMETERS':'参数',
       'SUCCESS':'操作成功',
       'IMPORT':'导入',
       'OPERATING':'操作',
       'VARIATION-LAW':'变量规律',
       'TYPE':'类型',
       'SUBMIT':'提交',
       'CANCEL':'取消',
       'MAIN-LIST-CHANGE':'更改接口路径',
       'MAIN-LIST-TITLE': '接口列表',
       'MAIN-LIST-Filter':'输入内容筛选接口',
       'MAIN-LIST-DELAY': '延时',
       'MAIN-LIST-DELAY-EXPLANATION': '模拟极端环境中，接口调用缓慢的情况',
       'MAIN-LIST-OPERATING':'操作',
       'MAIN-ADD-TITLE':'添加新接口',
       'MAIN-ADD-TITLE-EXPLANATION':'接口路径不能重复，输入的接口必须为/开始且{{interfaceSuffix}}结尾',
       'MAIN-ADD-EXPLANATION':'接口必须以/开始且{{interfaceSuffix}}结尾',
       'MAIN-RECORD-TITLE':'接口录制',
       'MAIN-RECORD-TITLE-EXPLANATION':'录制接口必须保证你的电脑支持Curl，可以通过访问将返回的结果记录下来',
       'MAIN-RECORD-URL-EXPLANATION':'请求的url地址',
       'MAIN-ERROR-LOG-TITLE':'错误日志',
       'MAIN-ERROR-LOG-TITLE-EXPLANATION':'验证代码请求和接口文档之间的差异：蓝色代表请求方式不正确，eg. POST 用成了 GET。黄色代表你的代码有更新，你的接口文档没有及时更新，请及时更新你的接口文档。 红色表示你的代码发出请求的时候，参数不满足当时的接口文档的约定。',
       'DETAIL-TITLE':'接口详情',
       'DETAIL-URL':'接口请求地址',
       'DETAIL-URL-NEW':'新接口请求地址',
       'DETAIL-LAZY-LOAD':'是否需要延时加载',
       'DETAIL-TYPE':'接口类型',
       'DETAIL-JSONP':'是否提供Jsonp服务',
       'DETAIL-REMARK':'备注',
       'DETAIL-REQUEST-PARAMETERS':'请求参数',
       'DETAIL-PARAMETERS-NAME':'变量名',
       'DETAIL-RETURN-DYNAMIC-INTERFACE':'返回动态接口',
       'DETAIL-RETURN-STATIC-INTERFACE':'返回静态接口',
       'DETAIL-RETURN-INTERFACE':'返回接口',
       'DETAIL-FILL-OUT':'填写接口',
       'DETAIL-MOCKJS-DEMO':'查看Mockjs例子',
       'DETAIL-IMPORT-TITLE':'导入返回JSON数据',
       'DETAIL-IMPORT-INPUT':'导入新的JSON数据，之前的JSON数据将会被覆盖...',
       'DETAIL-IMPORT-ERROR':'json格式不正确',
       'SERVER-ERROR-LOG':'请求接口 => {{url}} 未创建',
       'SERVER-MENU-TITLE':'### 接口文档目录\n|序号 |接口请求地址 |接口说明 |\n| -------- | -------- |-------- | \n',
       'SERVER-CURL-LOG':'Curl命令',
       'SERVER-PARAMETER-TITLE':'#### 请求参数\n|序号 |参数名 |是否必填 |说明 |\n| -------- | -------- |-------- |-------- |  \n',
       'SERVER-MEDTH-ERROR':'请求类型异常请确认',
       'SERVER-ERROR-PARAMETER-1':'请求参数［{{parameters}}］应该为必填项',
       'SERVER-ERROR-PARAMETER-2':'接口文档缺少［{{parameters}}］做为请求参数',
       'SERVER-WARN':'接口警告',
       'SERVER-WARN-TEXT':'请求类型异常请确认'
     }
   }

   return languages[preferredLanguage] || languages['cn'];
}