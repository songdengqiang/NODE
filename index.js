//主入口文件
//模块的引入（内部模块以及外部模块）
const configuration = require('./configuration');
const login = require('./router/login');
const user = require('./router/user');
const packages = require('./myPackage');
const pak = new packages();
//全局变量
const ports = 8888;
const hosts = pak.getLocalIpv4(); //获取本机的IP地址


//配置相关的参数
const app = configuration.setting();

//路由的引用
app.get('/',function (req,res) {
    res.send("系统启动！")
});
app.use('/login',login);
app.use('/user',user);

//状态的监听
app.listen(ports,function () {
    console.log("访问地址为 http://%s:%s", hosts, ports)
});