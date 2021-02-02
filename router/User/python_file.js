const express = require('express');
const router = express.Router();
const packages = require('../../myPackage');
const fs = require('fs')
const MP = new packages();

/* 项目得路由-周彬师兄系统的页面路由 */
// 获取代办的任务数据
router.post('/pdfsubmit',function (req,res) {
    console.log(res)
});

module.exports = router;