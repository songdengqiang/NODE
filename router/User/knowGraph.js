const express = require('express');
const router = express.Router();
const packages = require('../../myPackage');
const neo4j = require('neo4j-driver');
const MP = new packages();

const driver = neo4j.driver(
    'bolt://localhost:11003',
    neo4j.auth.basic('neo4j', '20160626')
);

/* 用户界面功能 */
// 获取所有的实体标签
router.get('/getData',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.match_label(session,function (data) {
        res.send(data)
    })
});
// 获取或有的知识网络 实体 关系
router.get('/AllData',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.match_Kgnet(session,function (data) {
        res.send(data)
    })
});
router.get('/entitys',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.match_entity(session,function (data) {
        res.send(data)
    })
});
router.get('/relation',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.match_relation(session,function (data) {
        res.send(data)
    })
});
// 添加实体
router.post('/createE',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.create_entity(session,req.body,function (data) {
        res.send('成功')
    });
});
// 删除实体及其具有的所有关系
router.post('/deleteE',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.delete_entity(session,req.body,function (data) {
        res.send('成功')
    });
});
// 添加实体关系
router.post('/createR',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.create_relation(session,req.body,function (data) {
        res.send('成功')
    });
});
// 删除实体关系
router.post('/deleteR',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.delete_relation(session,req.body,function (data) {
        res.send('成功')
    });
});
// 创建实体属性
router.post('/createA',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.create_attribute(session,req.body,function (data) {
        res.send('成功')
    });
});
// 删除实体属性
router.post('/deleteA',function (req,res) {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });
    MP.delete_attribute(session,req.body,function (data) {
        res.send('成功')
    });
});

module.exports = router;