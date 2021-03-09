const express = require('express');
const router = express.Router();
const fs = require('fs')
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
const hosts = MP.getLocalIpv4(); //获取本机的IP地址

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
    console.log(req.body)
    Object.keys(req.body).forEach((key) => {
        if (key === 'labels') {
            entityInfo.labels = req.body[key]
        } else {
            entityAttr[key] = req.body[key]
        }
    })
    entityInfo.attr = entityAttr
    neo4JCon.addOneEntity(entityInfo, function (data) {
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
router.get('/deleteAKg', function (req, res) {
    neo4JCon.deleteAll(function (data) {
        res.send('成功')
    })
}) //删除所有的知识节点
// 添加多组知识
router.post('/addManyKg1', function (req, res) {
    if (req.body === []) {
        res.send('成功')
    } else {
        for (let i = 0; i < req.body.length; i++) {
            neo4JCon.addManyKgEntity(req.body[i], function (data) {
                // console.log(data)
            })
        }
        res.send('成功')
    }
})
router.post('/addMangKg2', function (req, res) {
    if (req.body === []) {
        res.send('无关系导入')
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
// 查询知识节点
router.post('/searchKg1', function (req, res) {
    if (req.body === '') {
        res.send('查询失败')
    } else {
        // console.log(req.body)
        neo4JCon.searchKg(req.body, function (data) {
            // console.log(data)
            if (data.length > 0) {
                let entityList = {}
                entityList.nodes = []
                entityList.links = []
                let single = []
                for (let i of data) { //提取数据中记录，并按照模板进行匹配
                    let obj = {}
                    obj.target = i[2].start.low //提取实体的标识
                    obj.source = i[2].end.low //提取实体的标签
                    obj.relation = i[2].type
                    Object.keys(i[2].properties).forEach((key) => { //提取实体的属性
                        obj[key] = i[2].properties[key]
                    })
                    entityList.links.push(obj)
                    if (single.indexOf(i[0].properties.name) === -1) {
                        let obj = {}
                        obj.id = i[0].identity.low //提取实体的标识
                        obj.labels = i[0].labels //提取实体的标签
                        Object.keys(i[0].properties).forEach((key) => { //提取实体的属性
                            obj[key] = i[0].properties[key]
                        })
                        entityList.nodes.push(obj)
                        single.push(i[0].properties.name)
                    }
                    if (single.indexOf(i[1].properties.name) === -1) {
                        let obj = {}
                        obj.id = i[1].identity.low //提取实体的标识
                        obj.labels = i[1].labels //提取实体的标签
                        Object.keys(i[1].properties).forEach((key) => { //提取实体的属性
                            obj[key] = i[1].properties[key]
                        })
                        entityList.nodes.push(obj)
                        single.push(i[1].properties.name)
                    }
                }
                res.send(entityList)
            } else {
                res.send('查询失败！')
            }
        })

    }
})
// tabular页面的相关路由
router.post('/pdfsubmit', function (req, res) {
    MP.delDirFile('./router/User/project/zb_python/fileData')
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
                        obj.path = `http://${hosts}:8888/zb_pythonF/table-detect-master/test_in/${i}`
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
        MP.delDirFile('./test_out')
        MP.delDirFile('./imgcut')
        // console.log('新目录：' + process.cwd());
        PythonShell.run('table_detect.py', options, function (err, results) {
            if (err) throw err;
            // console.log(results)
            // results is an array consisting of messages collected during execution
            MP.searchFile('./test_out', function (data) {
                let objList = []
                for (let i of data) {
                    let obj = {}
                    obj.path = `http://${hosts}:8888/zb_pythonF/table-detect-master/test_out/${i}`
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
})

router.get('/pdfExtract1', function (req, res) {
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
        MP.searchFile('./imgcut', function (data) {
            let objList = []
            for (let i of data) {
                let obj = {}
                obj.path = `http://${hosts}:8888/zb_pythonF/table-detect-master/imgcut/${i}`
                objList.push(obj)
            }
            res.send({
                title: '成功',
                data: objList
            })
            process.chdir(pro_dirP)
        })
    } catch (err) {
        console.log('chdir：' + err);
        process.chdir(pro_dirP)
    }
})
router.post('/ocrFunc', function (req, res) {
    // console.log(req.body)
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        args: ['value1']
    };
    let pro_dirP = process.cwd()
    try {
        process.chdir('./public/pythonModule/百度AI调用表格识别接口'); //切换进程的文件目录
        MP.delDirFile('./picture')
        process.chdir(pro_dirP)
        process.chdir('./public/zb_pythonF/table-detect-master/imgcut'); //切换进程的文件目录
        let strP = req.body.path.split('/')
        MP.copyImg(`./${strP[strP.length-1]}`, '../../../public/pythonModule/百度AI调用表格识别接口/picture/result.png')
        // let list = fs.readFileSync(`./${strP[strP.length-1]}`)
        // console.log(list)
        process.chdir(pro_dirP)
        process.chdir('./public/pythonModule/百度AI调用表格识别接口'); //切换进程的文件目录
        PythonShell.run('api.py', options, function (err, results) {
            if (err) {
                console.log(err)
                res.send('失败')
            } else {
                // console.log(results)
                fs.readFile('export.txt', 'utf-8', (err, data) => {
                    if (err) res.send(err)
                    // console.log(data)
                    res.send({
                        title: '成功',
                        textContent: data,
                        textPath: `http://${hosts}:8888/pythonModule/百度AI调用表格识别接口/export.txt`
                    })
                    process.chdir(pro_dirP)
                })
            };
        });
    } catch (err) {
        console.log('chdir：' + err);
        res.send('失败')
        process.chdir(pro_dirP)
    }
})
router.post('/ocrFunc1', function (req, res) {
    // console.log(req.body)
    MP.delDirFile('./public/pythonModule/百度AI调用表格识别接口/picture')
    let form = new multiparty.Form({
        uploadDir:'./public/pythonModule/百度AI调用表格识别接口/picture'
    })
    form.parse(req,(err, fields, files) =>{
        if(err){
            console.log(err)
            res.send('失败1')
        }else{
            let options = {
                mode: 'text',
                pythonOptions: ['-u'], // get print results in real-time
                args: ['value1']
            };
            let pro_dirP = process.cwd()
            try {
                process.chdir('./public/pythonModule/百度AI调用表格识别接口'); //切换进程的文件目录
                PythonShell.run('api.py', options, function (err, results) {
                    if (err) {
                        console.log(err)
                        res.send('失败2')
                    } else {
                        // console.log(results)
                        fs.readFile('export.txt', 'utf-8', (err, data) => {
                            if (err) res.send(err)
                            // console.log(data)
                            res.send({
                                title: '成功',
                                textContent: data,
                                textPath: `http://${hosts}:8888/pythonModule/百度AI调用表格识别接口/export.txt`
                            })
                            process.chdir(pro_dirP)
                        })
                    };
                });
            } catch (err) {
                console.log('chdir：' + err);
                res.send('失败')
                process.chdir(pro_dirP)
            }
            // res.send('成功')
        }
    })
})
router.post('/modifyAttr',function(req,res){
    // console.log(req.body)
    neo4JCon.modifyAttr(req.body,(datas)=>{
        res.send(datas)
    })
})

module.exports = router;