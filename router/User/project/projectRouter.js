const express = require('express');
const router = express.Router();
const zsystem = require('./zbSystem')

/* 用户界面功能 */
// 获取所有的实体标签
router.use('/zbSystem', zsystem)
// 获取或有的知识网络 实体 关系
router.get('/ceshi',function(req,res){
    res.send('fdsfds')
})


module.exports = router;