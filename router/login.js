const express = require('express');
const router = express.Router();
const packages = require('../myPackage');
const pak = new packages();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Login = new Schema({
    account: {type:String},//登录账户
    password: {type: String} // 登录密码
});
const loginD = mongoose.model('Login', Login);

/* 登录功能 */
router.get('/getData',function (req,res) {
    res.send('ccc')
});
router.post('/check',function (req,res) {
    loginD.find({account:req.body.account,password:req.body.password},function (err,data) {
        // console.log(data);
        if(data.length >0 ){
            res.send("成功！")
        }else {
            res.send("失败！")
        }
    })
});
router.post('/insertData',function (req,res) {
    // console.log(result);
    const registerD = new loginD({
        account:req.body.account,
        password:req.body.password
    });
    registerD.save(function (err,data) {
        if(err){
            console.log(err)
        }else {
            res.send("成功！")
        }
    })
});
/* 注册功能 */

module.exports = router;