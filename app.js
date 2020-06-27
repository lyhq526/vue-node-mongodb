const express = require('express');
const user = require('./server/user')
const mongoose = require("mongoose");
const path = require('path')
const fs = require('fs')
const bodyParser = require("body-parser")
const app = express()
var jwt = require('jsonwebtoken')
const video = require("./server/video")
const pan = require("./server/pan")

//这一句是连接上数据库
var db = mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

//这里的myDbs是数据库的名字，不是表的名字




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//校验token是否正确
app.use(function (req, res, next) {
  //校验token过滤登录注册页
  if (req.url == "/api/user/login" || req.url =='/api/user/register') {
    next()
  } else {
    //校验token
    jwt.verify(req.get("Set-Token"), "lyhq", function (err, decode) {
      if (err) {  //校验token失败    
        res.send({ code: 401, message: "请重新登录" });
      } else {
        next()
      }
    })
  }
})
app.use('/api', user)

// app.use(express.static(path.resolve(__dirname, './dist')))
// // 首页静态页面
// app.get('*', function(req, res) {
//   const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
//   res.send(html)
// })
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});
// 监听80端口
app.listen(3000);
console.log('server is running 3000');


