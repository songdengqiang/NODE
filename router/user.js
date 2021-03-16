const express = require('express');
const router = express.Router();
const Kgraph = require('./User/knowGraph');
const fs = require('fs')
const packages = require('../myPackage');
const pak = new packages();
const multiparty = require('multiparty');
const axios = require('axios')
const cheerio = require('cheerio')
const plans = require('./User/plan');
const project = require('./User/project/projectRouter')
const mongoCon = require('../public/mypackage/connectMongo')
const hosts = pak.getLocalIpv4(); //获取本机的IP地址

/* 用户界面的use功能 */
router.use('/kGraph', Kgraph);
router.use('/plan', plans)
router.use('/project', project)

//用户界面的post
router.post('/registerP', function (req, res) {
    mongoCon.findAllData(req, function (data) {
        if (data === '数据不存在') {
            mongoCon.addperSonData(req, function (data) {
                if (data === "成功") {
                    res.send('注册成功！')
                } else {
                    res.send('注册失败！')
                }
            })
        } else {
            res.send("改用户已存在！")
        }
    })

})
router.post('/loginP', function (req, res) {
    mongoCon.findData(req, function (data) {
        if (data === "成功") {
            res.send('登录成功！')
        } else {
            res.send('登录失败！')
        }
    })
})

router.post('/addImgs', function (req, res) {
    // console.log('dsfds ')
    let form = new multiparty.Form({
        uploadDir: './public/images'
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send(err)
        } else {
            res.send('成功')
        }
    })
})
router.get('/sendImg', function (req, res) {
    try {
        pak.searchFile('./public/images', function (data) {
            let objList = []
            for (let i of data) {
                let obj = {}
                obj.path = `http://${hosts}:8888/images/${i}`
                objList.push(obj)
            }
            res.send({
                title: '成功',
                data: objList
            })
        })
    } catch (err) {
        console.log(err)
    }
})
//颜色信息的路由
router.get('/findColor',function(req,res){
    mongoCon.findColor((data)=>{
        res.send(data)
    })
})

router.get('/getFuncName', function (req, res) {
    pak.readJson('imgStyle.json', function (data) {
        res.send(data)
    })
})
router.get('/getColorInfo', function (req, res) {
    pak.readJson('Color/colorJson.json', function (data) {
        res.send(data)
    })
})
router.get('/getColorInfo1', function (req, res) {
    pak.readJson('Color/AutoDeskColorAscall.json', function (data) {
        res.send(data)
    })
})
router.get('/getSevenColor', function (req, res) {
    pak.readJson('Color/sevenColor.json', function (data) {
        res.send(data)
    })
})
router.get('/getSaying', function (req, res) {
    pak.readJson('saying.json', function (data) {
        res.send(data)
    })
})
router.post('/postImgData', function (req, res) {
    let form = new multiparty.Form({
        uploadDir: './public/images'
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send(err)
        }
        pak.readJson('imgStyle.json', function (data) {
            let existence = false
            for (let i = 0; i < data.length; i++) {
                if (fields.style[0] === data[i].name) {
                    existence = true
                    const newData = {}
                    newData.name = fields.name[0]
                    newData.Saying = fields.Saying[0]
                    const str = files.img[0].path.split('\\').pop()
                    newData.imgPath = '/images/' + str
                    data[i].imgS.push(newData)
                    data[i].num = data[i].imgS.length
                    // console.log(data[i])
                    pak.writeJson('imgStyle.json', data)
                    res.send('成功！')
                }
            }
            if (!existence) {
                const newStyleD = {}
                newStyleD.name = fields.style[0]
                newStyleD.num = 0
                newStyleD.id = 0
                newStyleD.imgS = []
                const newData = {}
                newData.name = fields.name[0]
                newData.Saying = fields.Saying[0]
                const str = files.img[0].path.split('\\').pop()
                newData.imgPath = '/images/' + str
                newStyleD.imgS.push(newData)
                newStyleD.num = newStyleD.imgS.length
                data.push(newStyleD)
                pak.writeJson('imgStyle.json', data)
                res.send('成功！')
            }
        })
    })
})
// 颜色得挖掘
router.get('/colorW', function (req, res) {
    let httpUrl = 'http://www.5tu.cn/colors/rgb-peisebiao.html'
    let colorList = []
    axios.get(httpUrl, {
        encoding: 'binary'
    }).then(function (ress) {
        let $ = cheerio.load(ress.data)
        // console.log($)
        let info = $('tbody tr').each((i, element) => {

        })
        let infoList = info.split('<br>')
        for (let i = 0; i < infoList.length; i++) {
            let colorJson = {}
            let List = infoList[i].split(' ')
            colorJson.AciValue = List[0]
            colorJson.decimal_R = List[1]
            colorJson.decimal_G = List[2]
            colorJson.decimal_B = List[3]
            colorList.push(colorJson)
        }
        // console.log(colorList)
        pak.writeJson('AutoDeskColorAscall.json', colorList)
        res.send("数据挖掘成功！")
    })
})
//天气数据的挖掘
router.get('/weathers', function (req, res) {
    let httpUrl = 'https://tianqiapi.com/api.php?style=tq&skin=pitaya'
    let weather = {}
    axios.get(httpUrl).then(function (ress) {
        let $ = cheerio.load(ress.data)
        // console.log($)
        let info = $('body').text()
        let weatherList = info.split(' ')
        weather.descript = weatherList[2]
        weather.temperature = weatherList[4]
        weather.wind = weatherList[5]
        res.send(weather)
    })
})

module.exports = router;