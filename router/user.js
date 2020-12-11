const express = require('express');
const router = express.Router();
const Kgraph = require('./User/knowGraph');
const fs = require('fs')
const packages = require('../myPackage');
const pak = new packages();

/* 用户界面功能 */
router.use('/kGraph',Kgraph);
router.get('/getFuncName', function(req, res){
    pak.readJson('imgStyle.json',function(data){
        res.send(data)
    })
})
router.get('/getSaying', function(req, res){
    pak.readJson('saying.json',function(data){
        res.send(data)
    })
})
router.post('/postImgData', function(req, res){
    res.send('成功!')
})

module.exports = router;