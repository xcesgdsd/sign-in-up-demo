const express = require('express')
//创建路由对象
const router = express.Router()


//导入用户路由处理模块
const user_handle = require('../router_handle/user') 


//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
//导入需要的验证规则
const { reg_login_schema } = require('../schema/user')


//注册新用户
router.post('./reguser',user_handle.regUser)
//登录用户
router.post('/login',user_handle.login)

//共享路由对象
module.exports = router