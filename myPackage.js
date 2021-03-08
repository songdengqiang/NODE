const os = require('os');
const dns = require('dns');
const XmlParser = require('xmljs');
const fs = require('fs');
const path = require('path')

module.exports = function () {
    //文档的帮助文档,可以概括解释包中所带有的函数
    var str = {
        getLocalIpv4: "获取本机的内网地址：具有一个返回值（IPv4）:实例：var Ipv4 = myPackage.getLocalIpv4( )",
        getLocalIpv6: "获取本机的内网地址：具有一个返回值(数组)（IPv6）:实例：var Ipv6 = myPackage.getLocalIpv6( )",
        getLocalTime: "获取本地的时间,返回的是一个对象，包括年-月-日-星期-时-分-秒",
        readXmlFile: "读取一个xml文档，需要输入根节点名称，获取的数据以回调函数返回。"
    };
    this.help = function () {
        for (const i in str) {
            console.log("函数:" + i + " 介绍：" + str[i]);
        }
    }; //打印包中所有的函数以及相关作用

    this.getLocalIpv4 = function () {
        var interfaces = os.networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }; //获取本机的内网地址：具有一个返回值（IPv4）

    this.getLocalIpv6 = function () {
        return strIpv6 = dns.getServers();
    }; //获取本机的内网地址：具有一个返回值(数组)（IPv6）

    this.getLocalTime = function () {
        var data = new Date();
        return o = {
            Year: data.getFullYear(), //获取年份值
            Month: data.getMonth() + 1, //获取月份值，得到的月份值比真实值少一个月
            Day: data.getDate(), //获取日期
            Weekday: "周" + data.getDay(), //获取星期
            Hours: data.getHours(), //获取当前时间的小时值
            Minutes: data.getMinutes(), //获取当前时间的分钟值
            Seconds: data.getSeconds() //获取当前时间的秒值
        }

    }; //获取本地的时间

    this.readXmlFile = function (filename, fatherArray, callback) {
        var p = new XmlParser({
            strict: true
        });
        var xml = fs.readFileSync(filename); // XML in the examples direct
        var xmlNode = p.parseString(xml, function (err, xmlNode) {
            if (err) {
                console.error(err);
                return;
            }
            var nodes = xmlNode.path(fatherArray, true);
            callback(nodes);
        });
    };
    this.readJson = function (fileName, callback) {
        fs.readFile('./public/data/' + fileName, function (err, date) {
            const jsonData = JSON.parse(date)
            callback(jsonData)
        })
    }
    this.writeJson = function (fileName, heros, callback) {
        fs.writeFile('./public/data/' + fileName, JSON.stringify(heros), function (err, data) {
            callback('成功')
        })
    }
    this.addJson = function (fileName, heros, callback) {
        fs.readFile('./public/data/' + fileName, function (err, date) {
            const jsonData = JSON.parse(date)
            jsonData.push(heros)
            fs.writeFileSync('./public/data/' + fileName, JSON.stringify(jsonData), function (err, data) {
                console.log(err)
            })
        })

    }
    this.searchFile = function (pathName, callback) {
        fs.readdir(pathName, function (err, files) {
            var dirs = [];
            (function iterator(i) {
                if (i == files.length) {
                    // console.log(dirs);
                    callback(dirs)
                    return;
                }
                fs.stat(path.join(pathName, files[i]), function (err, data) {
                    if (data.isFile()) {
                        dirs.push(files[i]);
                    }
                    iterator(i + 1);
                });
            })(0);
        });
    } //获取文件夹下的所有文件名和路径
    this.delDirFile = function (path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
        }
    }//删除文件夹下的文件
    this.copyImg = function (oPath,nPath) {
        fs.readFile(oPath,function(err,originBuffer){            //读取图片位置（路径）
            console.log(Buffer.isBuffer(originBuffer));
        
            fs.writeFile(nPath,originBuffer,function(err){      //生成图片2(把buffer写入到图片文件)
                if (err) {
                    console.log(err)
                }
            });
        })
    } // 下载图片
}