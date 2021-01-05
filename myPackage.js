const os = require('os');
const dns = require('dns');
const XmlParser = require('xmljs');
const fs = require('fs');

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
    };//获取本机的内网地址：具有一个返回值（IPv4）

    this.getLocalIpv6 = function () {
        return strIpv6 = dns.getServers();
    };//获取本机的内网地址：具有一个返回值(数组)（IPv6）

    this.getLocalTime = function () {
        var data = new Date();
        return o = {
            Year: data.getFullYear(), //获取年份值
            Month: data.getMonth() + 1,   //获取月份值，得到的月份值比真实值少一个月
            Day: data.getDate(),//获取日期
            Weekday: "周" + data.getDay(),//获取星期
            Hours: data.getHours(), //获取当前时间的小时值
            Minutes: data.getMinutes(), //获取当前时间的分钟值
            Seconds: data.getSeconds()//获取当前时间的秒值
        }

    };//获取本地的时间

    this.readXmlFile = function (filename, fatherArray, callback) {
        var p = new XmlParser({strict: true});
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

    this.match_label = function (session,callback) {
        session
            .run('match (n) return distinct labels(n)')
            .then(function (result) {
                const lists = [];
                result.records.forEach(function (record){
                    lists.push(record._fields[0][0])
                })
                callback(lists)
            })
            .catch(function (err) {
                console.log(err)
            })
            .then(function () {
                session.close()
            });
    }; // 查询所有的单一标签
    this.match_entity = function (session,callback) {
        session
            .run('match (n) return n')
            .then(function (result) {
                const lists = [];
                result.records.forEach(function (record){
                    lists.push(record._fields[0].properties.name)
                })
                callback(lists)
            })
            .catch(function (err) {
                console.log(err)
            })
            .then(function () {
                session.close()
            });
    }; // 查询所有的实体
    this.match_relation = function (session,callback) {
        session
            .run('MATCH (n) OPTIONAL MATCH (n)-[r]-() return r')
            .then(result => {
                var a = [];
                result.records.forEach(record => {
            // console.log(record._fields);
            const data = {};  //关系数据结构的生成
                    if (record._fields[0] !== null){
                        data.source = record._fields[0].start.low;
                        data.target = record._fields[0].end.low;
                        data.relation = record._fields[0].type;
                        data.value = 1;
                        // console.log(data);
                        var repead = false;
                        for (let i=0;i<a.length;i++){
                            if (a[i].source === data.source && a[i].target === data.target){
                                repead = true;
                                break;
                            }
                        }
                        if (!repead){
                            a.push(data)
                        }
                    }
                });
                callback(a)
            })
            .catch(error => {
                console.log(error)
            })
            .then(() => session.close());
    };// 查询所有的关系
    this.match_Kgnet = function (session,callback) {
        session
            .run('match(n) OPTIONAL MATCH (n)-[r]-() return n,r')
            .then(function (result) {
                const panduan ={};
                const a = []; // 实体集合
                const b = []; // 关系集合
                result.records.forEach(function (record){
                    const data = {};  //实体节点结构的生成
                    const data1 = {};  //关系节点结构的生成
                    data.id = record._fields[0].identity.low;
                    data.label = record._fields[0].labels[0];
                    data.attribute = record._fields[0].properties;
                    if (!panduan[data.id]){
                        a.push(data)
                        panduan[data.id] = true
                    }
                    if (record._fields[1] !== null){
                        data1.source = record._fields[1].start.low;
                        data1.target = record._fields[1].end.low;
                        data1.relation = record._fields[1].type;
                        // console.log(data);
                        var repead = false;
                        for (let i=0;i<b.length;i++){
                            if (b[i].source === data1.source && b[i].target === data1.target){
                                repead = true;
                                break;
                            }
                        }
                        if (!repead){
                            b.push(data1)
                        }
                    }
                })
                callback([a,b])
            })
            .catch(function (err) {
                console.log(err)
            })
            .then(function () {
                session.close()
            });
    };// 查询知识网络 实体和关系
    this.create_entity = function (session,data,callback) {
        session
            .run('create(n:' + data.label + '{ name:"'+ data.name.toString() +'"}) return n')
            .then(result => {
            callback(result);
        })
        .catch(error => {
            console.log(error)
        })
        .then(() => session.close());
    }; // 创建实体
    this.delete_entity = function (session,data,callback) {
        session
            .run('match(n:' + data.label + '{ name:"'+ data.name.toString() +'"}) optional match(n)-[r]-() delete n,r')
            .then(function(result){
                callback(result);
            })
            .catch(function (err) {
                console.log(err)
            })
            .then(() => session.close());
        }; // 删除实体
    this.create_relation = function (session,data,callback) {
        session
            .run('match(a) where a.name="'+data.source+'" match(b) where b.name="'+data.target+'" create (a)-[r:'+data.relation+']->(b) return r')
            .then(result => {
                callback(result)
            })
            .catch(error => {
                console.log(error)
            })
            .then(() => session.close());
    };// 创建关系
    this.delete_relation = function (session,data,callback) {
        session
            .run('match(a) where a.name="'+data.source+'" match(b) where b.name="'+data.target+'" match (a)-[r:'+data.relation+']->(b) delete r ')
            .then(result => {
            callback(result)
        })
    .catch(error => {
            console.log(error)
    })
    .then(() => session.close());
    } // 删除关系
    this.create_attribute = function (session,data,callback) {
        session
            .run('match(n) where n.name=\''+ data.entity.toString() + '\' set n.' + data.attrName.toString() +'=\''+ data.attrValue.toString() + '\' return n')
            .then(result => {
           callback(result)
         })
        .catch(error => {
            console.log(error)
         })
        .then(() => session.close());
    } // 创建实体属性
    this.delete_attribute = function (session,data,callback) {
        session
            .run('match(n) where n.name=\''+ data.entity.toString() + '\' remove n.' + data.attrName.toString() + ' return n')
            .then(result => {
            callback(result)
        })
    .catch(error => {
            console.log(error)
    })
    .then(() => session.close());
    } // 删除实体属性
    this.readJson = function (fileName,callback) {
        fs.readFile('./public/data/'+fileName,function(err,date){
            const jsonData = JSON.parse(date)
            callback(jsonData)
        })
    }
    this.writeJson = function (fileName,heros,callback) {
        fs.writeFile('./public/data/'+fileName, JSON.stringify(heros),function(err,data){
            callback('成功')
        })
    }
    this.addJson = function (fileName,heros,callback) {
        fs.readFile('./public/data/'+fileName,function(err,date){
            const jsonData = JSON.parse(date)
            jsonData.push(heros)
            fs.writeFileSync('./public/data/'+fileName, JSON.stringify(jsonData),function(err,data){
                console.log(err)
            })
        })
        
    }
};
