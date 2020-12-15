const express = require('express');
const router = express.Router();
const Kgraph = require('./User/knowGraph');
const fs = require('fs')
const packages = require('../myPackage');
const pak = new packages();
const multiparty = require('multiparty');
const url = require('url')
const axios = require('axios')
const cheerio = require('cheerio')

/* 用户界面功能 */
router.use('/kGraph',Kgraph);
router.get('/getFuncName', function(req, res){
    pak.readJson('imgStyle.json',function(data){
        res.send(data)
    })
})
router.get('/getSaying', function(req, res){
    pak.readJson('saying.json',function(data){
        res.send(data)
    })
})
router.post('/postImgData', function(req, res){
    let form = new multiparty.Form({uploadDir: './public/images'})
    form.parse(req, (err, fields, files) => {
        if(err){res.send(err)}
        pak.readJson('imgStyle.json', function(data){
            let existence = false
            for(let i=0;i<data.length;i++){
                if(fields.style[0] === data[i].name){
                    existence = true
                    const newData = {}
                    newData.name = fields.name[0]
                    newData.Saying = fields.Saying[0]
                    const str = files.img[0].path.split('\\').pop()
                    newData.imgPath = '/images/'+str
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
                newData.imgPath = '/images/'+str
                newStyleD.imgS.push(newData)
                newStyleD.num = newStyleD.imgS.length
                data.push(newStyleD)
                pak.writeJson('imgStyle.json', data)
                res.send('成功！')
            }
        }) 
    })
})
router.get('/ceshi', function (req, res) {
    let httpUrl = 'http://www.5tu.cn/colors/yansebiao.html'
    let colorList = []
    axios.get(httpUrl,{}).then(function (ress) {
        let $ = cheerio.load(ress.data)
        $('.tableborder>tr').each((i, element) => {
            console.log($(element).find('td').)
            // // if (colorTitle !== undefined) {
            // //     let lists = colorTitle.split(',')
            // //     colorJson.RGB = lists[0]
            // //     colorJson.name = lists[1]
            // //     colorList.push(colorJson)
            // // }
        })
        
        // console.log($)
        res.send(colorList)
    })
})

module.exports = router;