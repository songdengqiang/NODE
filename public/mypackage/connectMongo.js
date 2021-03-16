const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/admin";
const options = {
    db: {
        native_parser: true
    },
    server: {
        poolSize: 5
    }, //最大连接池为5
    // replset: {rs_name: 'myReplicaSetName'},
    // user: 'xiao',
    // pass: '20160626'
}
// mongose数据库的链接
mongoose.connect(url, options); // 链接本地的默认数据库
// mongoose.connect(url); //链接默认的地址

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + 'mongodb://localhost:27017/admin');
}); /** * 连接异常 */
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
}); /** * 连接断开 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});
const Schema = mongoose.Schema;

//PersonInfo模式层与函数
const Login = new Schema({
    account: {type:String},//登录账户
    password: {type: String} // 登录密码
});
const loginD = mongoose.model('PersonInfo', Login);
let addperSonData = (data,callback)=>{
    const registerD = new loginD({
        account:data.body.account,
        password:data.body.password
    });
    registerD.save(function (err,data) {
        if(err){
            callback("失败")
        }else {
            callback('成功')
        }
    })
}   // 
let findAllData = (data,callback)=>{
    loginD.find({account:data.body.account},function (err,data) {
        // console.log(data);
        if(data.length >0 ){
            callback("数据存在")
        }else {
            callback("数据不存在")
        }
    })
}
let findData = (data,callback)=>{
    loginD.find({account:data.body.account,password:data.body.password},function (err,data) {
        // console.log(data);
        if(data.length >0 ){
            callback("成功")
        }else {
            callback("失败")
        }
    })
}

//  颜色的存储模式层与函数
const colorData = new Schema({
    eName: {type:String},//
    RGB: {type: String}, //
    decimal: {type: String},
    descript:{type: String},
});
const colorSchema = mongoose.model('colorData', colorData);

let addColor = (data,callback)=>{
    const colorD = new colorSchema({
        eName: data.eName,//
        RGB: data.RGB, //
        decimal: data.decimal,
        descript:data.descript,
    });
    colorD.save(function (err,data) {
        if(err){
            callback("失败")
        }else {
            callback('成功')
        }
    })
}
let findColor = (callback) =>{
    colorSchema.find((err,data)=>{
        callback(data)
    })  
}







module.exports = {
    addperSonData,  // 添加数据
    findAllData,   // 查询所有数据
    findData,   //查询一组数据
    addColor,  // 添加颜色信息数据
    findColor,  //查询所有的颜色信息
}