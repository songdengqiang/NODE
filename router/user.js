const express = require('express');
const router = express.Router();
const Kgraph = require('./User/knowGraph');
const fs = require('fs')
const packages = require('../myPackage');
const pak = new packages();

/* 用户界面功能 */
router.use('/kGraph',Kgraph);
router.get('/getFuncName', function(req, res){
    pak.readJson('Login.json',function(data){
        pak.writeJson('ddd.json',data)
        res.send('cdd')
    })
})

module.exports = router;