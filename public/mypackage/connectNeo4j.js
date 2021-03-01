const neo4j = require('neo4j-driver')
const {
    list
} = require('pm2')
const db = 'bolt://localhost' // http://localhost:7474 bolt://localhost:7687
const dbuser = 'Graphs'
const dbpassword = '123456789'
// 连接数据库
const driver = neo4j.driver(db, neo4j.auth.basic(dbuser, dbpassword), {
    maxTransactionRetryTime: 30000
})

let getallentity = (callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    session
        .run('MATCH (n) return n')
        .then(result => {
            let entityList = []
            result.records.forEach(record => {
                entityList.push(record._fields)
            })
            callback(entityList)
        })
        .catch(error => {
            callback(error)
        })
        .then(() => session.close())
}
let getAllKg = (callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    session
        .run('MATCH (n) OPTIONAL MATCH (n)-[r]-() return r')
        .then(result => {
            let entityList = []
            result.records.forEach(record => {
                entityList.push(record._fields)
            })
            callback(entityList)
        })
        .catch(error => {
            callback(error)
        })
        .then(() => session.close())
}
let deleteOneEntity = (data, callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    session
        .run(`match(n:${data.labels} {name:"${data.attr.name}"}) optional match(n)-[r]-() delete n,r`)
        .then(result => {
            callback('成功！')
        })
        .catch(error => {
            callback(error)
        })
        .then(() => session.close())
}
let addOneEntity = (data, callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    let str = '{'
    Object.keys(data.attr).forEach((key) => {
        str = `${str} ${key}:"${data.attr[key]}",`
    })
    str = str.substring(0, str.length - 1);
    str = str + '}'
    session
        .run(`merge(n:${data.labels} ${str} ) return n`)
        .then(result => {
            let entityList = []
            result.records.forEach(record => {
                entityList.push(record._fields)
            })
            callback(entityList)
        })
        .catch(error => {
            callback(error)
        })
        .then(() => session.close())
}
let addOneRelation = (data, callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    session
        .run(`match(a) where a.name = "${data.head}" match(b) where b.name = "${data.foot}" create (a)-[r:${data.relation}]->(b) return r`)
        .then(result => {
            let entityList = []
            result.records.forEach(record => {
                entityList.push(record._fields)
            })
            callback('成功')
        })
        .catch(error => {
            // console.log(error)
            callback(error)
        })
        .then(() => session.close())
}
let deleteOneRelation = (data, callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    session
        .run(`match(a) where a.name = "${data.head}" match(b) where b.name = "${data.foot}" match (a)-[r:${data.relation}]->(b) delete r return r`)
        .then(result => {
            let entityList = []
            result.records.forEach(record => {
                entityList.push(record._fields)
            })
            callback('成功')
        })
        .catch(error => {
            // console.log(error)
            callback(error)
        })
        .then(() => session.close())
}
let addManyKgEntity = (data, callback) => {
    const session = driver.session({
        defaultAccessMode: neo4j.session.READ
    })
    session.run(`merge(n:${data.labels} {name:"${data.name}"}) return n`)
        .then(result => {
            callback('成功')
        })
        .catch(error => {
            callback(error)
        })
        .then(() => session.close())
}


module.exports = {
    getallentity, //查询所有的实体
    getAllKg, //查询所有的关系集
    addOneEntity, //添加一个实体
    deleteOneEntity, //删除一个实体
    addOneRelation, //添加一组关系
    deleteOneRelation, //删除一组关系
    addManyKgEntity, //添加多组知识
}