//导入express
const express = require('express')
//导入跨域cors中间件
const cors = require('cors')
//创建express服务器实例
const app = express()
//导入登录/注册用户路由模块
const userRouter = require('./router/user')
//导入配置文件
const config = require('./config')
//解析token中间件
const expressJWT = require('express-jwt')


//配置跨域cors
app.use(cors())

//配置表单解析数据中间件
app.use(express.urlencoded({extended:false}))

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

//在路由之前封装res函数
app.use((req,res,next) =>{
    //status默认1，表失败
    res.cc = function (err,status = 1) {
        res.send({status ,message:err instanceof Error ? err.message : err})
    }
    next()
})

//全局挂载路由
app.use('/api',userRouter)

const joi = require('joi')
app.use(function (err,req,res,next){
    if(err instanceof joi.ValidationError) return res.cc(err)
    res.cc(err)
})

app.get('', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})
//静态资源托管
app.use(express.static(__dirname + '/public'))

//调用app.listen监听
app.listen(3007,function() {
    console.log('api server runing at http://127.0.0.1:3007')
})

