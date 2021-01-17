const express = require('express');
const router = express.Router();
const packages = require('../../myPackage');
const fs = require('fs')
const MP = new packages();

/* 用户界面功能-个人计划页面路由 */
// 获取代办的任务数据
router.get('/deal_py',function (req,res) {
    MP.readJson('plan/task_list.json',function(data){
        res.send(data)
    })
});

module.exports = router;