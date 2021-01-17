const express = require('express');
const router = express.Router();
const packages = require('../../myPackage');
const fs = require('fs')
const MP = new packages();

/* 用户界面功能-个人计划页面路由 */
// 获取代办的任务数据
router.get('/getTaskList',function (req,res) {
    MP.readJson('plan/task_list.json',function(data){
        res.send(data)
    })
});
//写入代办的任务数据
router.post('/addTaskList',function(req,res){
    MP.writeJson('plan/task_list.json',req.body,(ress)=>{
        res.send(ress)
    })
})
// 获取今日的任务列表
router.get('/get_today_plan',function (req,res) {
    MP.readJson('plan/today_plan.json',function(data){
        res.send(data)
    })
});
//写入今日的任务数据
router.post('/add_today_plan',function(req,res){
    MP.writeJson('plan/today_plan.json',req.body,(ress)=>{
        res.send(ress)
    })
})
//写入完成的任务数据
router.post('/result_today',function(req,res){
    // console.log(req.body)
    MP.addJson('plan/result_today.json',req.body,(ress)=>{
        res.send(ress)
    })
})
router.post('/add_finish_plan',function(req,res){
    // console.log(req.body)
    MP.addJson('plan/all_finish_plan.json',req.body,(ress)=>{
        res.send(ress)
    })
})
router.get('/get_result_today',function(req,res){
    MP.readJson('plan/result_today.json',function(data){
        res.send(data)
    })
})
module.exports = router;