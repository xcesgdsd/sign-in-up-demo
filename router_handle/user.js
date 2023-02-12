//注册用户
//导入数据库木块
const db = require('../db/index')
const bcrypt  = require('bcryptjs')
//生成token包
const jwt = require('jsonwebtoken')
//导入配置文件
const config = require('../config')


exports.regUser = (req,res) =>{
    // res.send('注册用户接口')
    const userinfo = req.body
    //判断数据合法
    //1、判断是否为空
    // if(!userinfo.username || !userinfo.password){
    //     return res.cc('用户名或密码不合法')
    // }
    //2、检测是否占用,查询数据库
    const sql = 'select * from ev_user where username=?'
    db.query(sql,[userinfo.username],function (err,results){
        if(err){
            return res.cc(err)
        }
        if (results.length > 0){
            return res.cc('用户名被占用！')
        }

        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        const sql = 'insert into ev_user set ?'
        db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results) =>{
            if(err) {
                return res.cc(err)
            }
            if(results.affectedRows !== 1) {
                return res.cc('注册用户失败！')
            }
            res.send({status: 0 , message:'注册成功！'})      
        })
    })
    
}

//登录
exports.login = (req,res) =>{
   const userinfo = req.body
   const sql = 'select * from ev_user where username=?'
   db.query(sql,userinfo.username,function(err,results) {
        if(err) 
        return res.cc(err)
        if(results.length !==1) 
        return results.cc('登陆失败')
        //判断密码是否正确
        const compareResult =  bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult) {
         return res.cc('密码错误')
        }
        const user = {...results[0],password:'',user_pic:''}
        //对用户进行加密，生成一个token
        const tokenStr = jwt.sign(user,config.jwtSecerKey,{
            expiresIn:'10h'
        })
        res.send({
            status:0,
            message:'登陆成功',
            token:'Bearer' + tokenStr
        })
    })
}