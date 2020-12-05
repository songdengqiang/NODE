const session = require('express-session');
const body_parser = require('body-parser');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const url = "mongodb://localhost:27017/xiaoqiang";
const options = {
    db: {native_parser: true},
    server: {poolSize: 5},//最大连接池为5
    // replset: {rs_name: 'myReplicaSetName'},
    user: 'xiao',
    pass: '20160626'
}

exports.setting = function () {
    // app.engine('.html', require('ejs').__express);//设置模板引擎
    app.set("views","public"); //更改静态目录
    app.set('view engine', 'html');//实现模板引擎读取html文件
    app.use(body_parser.urlencoded({ extended: false }));
    app.use(body_parser.json());
    app.use(express.static('public')); //配置静态目录
    app.set('public', path.join(__dirname, 'public'));
    app.use(session({
        secret: 'keyboard cat',  //编码形式
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge:1000*60*10    //最大过期时间为十分钟
        },
        rolling:true     //若在操作，则关闭后的十分钟后失效
    }));
    app.all('*', function(req, res,next) {  //跨域请求配置
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });


    // // mongose数据库的链接
    // mongoose.connect(url,options);// 链接本地的默认数据库
    // // mongoose.connect(url); //链接默认的地址

    // mongoose.connection.on('connected', function () {
    //     console.log('Mongoose connection open to ' + 'mongodb://localhost:27017/xiaoqiang'); }); /** * 连接异常 */
    // mongoose.connection.on('error',function (err) {
    //     console.log('Mongoose connection error: ' + err); }); /** * 连接断开 */
    // mongoose.connection.on('disconnected', function () {
    //     console.log('Mongoose connection disconnected'); });

    return app;
};