const express = require('express');
const router = express.Router();
const packages = require('../../../myPackage');
const neo4j = require('neo4j-driver');
const MP = new packages();
const multiparty = require('multiparty');
var PDFImage = require("pdf-image").PDFImage;
const neo4JCon = require('../../../public/mypackage/connectNeo4j')
const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: "./public/pythonF/fileData",
    format: "png",
    width: 600,
    height: 600
};
/* 用户界面功能 */
router.get('/ceshi', function (req, res) {
    res.send('成功!')
})
// 获取所有的实体标签
router.get('/getAllEntity', function (req, res) {
    neo4JCon.getallentity((data) => {
        // console.log(data)
        let entityList = []
        for (let i of data) { //提取数据中记录，并按照模板进行匹配
            let obj = {}
            obj.id = i[0].identity.low //提取实体的标识
            obj.labels = i[0].labels //提取实体的标签
            Object.keys(i[0].properties).forEach((key) => { //提取实体的属性
                obj[key] = i[0].properties[key]
            })
            entityList.push(obj)
        }
        res.send(entityList)
    })
});
// 获取所有的知识组
router.get('/getAllKg', function (req, res) {
    neo4JCon.getAllKg(function (data) {
        let links = []
        for (let i of data) {
            if (i[0] !== null) {
                let link = {};
                link.target = i[0].start.low;
                link.source = i[0].end.low;
                link.relation = i[0].type;
                if (links.length > 0) {
                    let reapead = 0
                    for (let j of links) {
                        if (link.target === j.target && link.source === j.source && link.relation === j.relation) {
                            reapead = 1
                            break
                        }
                    }
                    if (!reapead) {
                        links.push(link)
                    }
                } else {
                    links.push(link)
                }
            }
        }
        // console.log(links)
        res.send(links)
    })
})
// 添加一个实体
router.post('/addEntity', function (req, res) {
    let entityInfo = {}
    let entityAttr = {}
    Object.keys(req.body).forEach((key) => {
        if (key === 'labels') {
            entityInfo.labels = req.body[key]
        } else {
            entityAttr[key] = req.body[key]
        }
    })
    entityInfo.attr = entityAttr
    neo4JCon.addOneEntity(entityInfo, function (data) {
        console.log(data)
        let entityList = []
        for (let i of data) { //提取数据中记录，并按照模板进行匹配
            let obj = {}
            obj.id = i[0].identity.low //提取实体的标识
            obj.labels = i[0].labels //提取实体的标签
            Object.keys(i[0].properties).forEach((key) => { //提取实体的属性
                obj[key] = i[0].properties[key]
            })
            entityList.push(obj)
        }
        res.send(entityList)
    })
})
// 删除一个实体
router.post('/deleteEntity', function (req, res) {
    let entityInfo = {}
    let entityAttr = {}
    Object.keys(req.body).forEach((key) => {
        if (key === 'labels') {
            entityInfo.labels = req.body[key]
        } else {
            entityAttr[key] = req.body[key]
        }
    })
    entityInfo.attr = entityAttr
    neo4JCon.deleteOneEntity(entityInfo, function (data) {
        res.send(data)
    })
})
// 添加一组知识
router.post('/addKg', function (req, res) {
    // console.log(req.body)
    neo4JCon.addOneRelation(req.body, function (data) {
        res.send(data)
    })
})
// 删除一组知识
router.post('/deleteKg', function (req, res) {
    // console.log(req.body)
    neo4JCon.deleteOneRelation(req.body, function (data) {
        res.send(data)
    })
})
// 添加多组知识
router.post('/addManyKg1', function (req, res) {
    if (req.body === []) {
        res.send('成功')
    } else {
        let num1 = 0
        // console.log(req.body)
        for (let i of req.body) {
            neo4JCon.addManyKgEntity(i, function (data) {
                if (data === '成功') {
                    num1++
                }
            })
        }
        res.send('成功')
    }
})
router.post('/addMangKg2', function (req, res) {
    if (req.body === []) {
        res.send('成功')
    } else {
        let num1 = 0
        // console.log(req.body)
        for (let i of req.body) {
            neo4JCon.addOneRelation(i, function (data) {
                if (data === '成功') {
                    num1++
                }
            })
        }
        res.send('成功')
    }
})

// tabular页面的相关路由
router.post('/pdfsubmit', function (req, res) {
    let form = new multiparty.Form({
        uploadDir: './public/pythonF/fileData'
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send(err)
        } else {
            res.send(files)
        }
    })
});
router.post('/pdfDeal', function (req, res) {
    let path = req.body.path.split('\\')
    // let imagePath = './public/pythonF/table-detect-master/test_in'
    let filePath = path[0]
    for (let i = 1; i < path.length; i++) {
        filePath = filePath + `/${path[i]}`
    }
    console.log(filePath)
    res.send('成功')

})

module.exports = router;