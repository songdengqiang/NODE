const express = require('express');
const router = express.Router();
const packages = require('../../../myPackage');
const neo4j = require('neo4j-driver');
const {
    exec
} = require('child_process')
const MP = new packages();
const {
    PythonShell
} = require('python-shell');
const multiparty = require('multiparty');
const neo4JCon = require('../../../public/mypackage/connectNeo4j')
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
        // console.log(req.body)
        for (let i = 0; i < req.body.length; i++) {
            neo4JCon.addManyKgEntity(req.body[i], function (data) {
                res.send('成功')
            })
        }
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
        uploadDir: './router/User/project/zb_python/fileData'
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
    //调用ImageMagick实现pdf文件转化为png
    exec(`magick -density 300 -define pdf:use-cropbox=true ./router/User/project/zb_python/fileData/${path[path.length-1]} ./public/zb_pythonF/table-detect-master/test_in/ceshi.png`, (err, stdout, stderr) => {
        if (err === null) {
            let pro_dirP = process.cwd()
            try {
                process.chdir('./public/zb_pythonF/table-detect-master'); //切换进程的文件目录
                MP.searchFile('./test_in', function (data) {
                    let objList = []
                    for (let i of data) {
                        let obj = {}
                        obj.path = `http://10.206.135.180:8888/zb_pythonF/table-detect-master/test_in/${i}`
                        objList.push(obj)
                    }
                    res.send({
                        title: '成功',
                        data: objList
                    })
                    process.chdir(pro_dirP)
                })
            } catch (错误) {
                console.log('chdir：' + err);
                process.chdir(pro_dirP)
            }
        } else {
            // res.send(err)
        }
    })
})

router.get('/pdfExtract', function (req, res) {
    // console.log('dfsd')
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        args: ['value1', 'value2', 'value3']
    };
    let pro_dirP = process.cwd()
    // console.log('起始目录：' + process.cwd());
    try {
        process.chdir('./public/zb_pythonF/table-detect-master'); //切换进程的文件目录
        // console.log('新目录：' + process.cwd());
        PythonShell.run('table_detect.py', options, function (err, results) {
            if (err) throw err;
            console.log(results)
            // results is an array consisting of messages collected during execution
            MP.searchFile('./imgcut', function (data) {
                let objList = []
                for (let i of data) {
                    let obj = {}
                    obj.path = `http://10.206.135.180:8888/zb_pythonF/table-detect-master/imgcut/${i}`
                    objList.push(obj)
                }
                res.send({
                    title: '成功',
                    data: objList
                })
                process.chdir(pro_dirP)
            })
        });
    } catch (错误) {
        console.log('chdir：' + err);
        process.chdir(pro_dirP)
    }

    // res.send('dd')
})
module.exports = router;