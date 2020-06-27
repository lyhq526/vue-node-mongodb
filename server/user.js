// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
var { User, Cookie } = require('../module/user')
var jwt = require('jsonwebtoken')
router.post('/user/register', (req, res) => {
  User.find({ userName: req.body.userName }, (err, data) => {
    if (err) {
      console.log('查询失败')
      res.send({ code: 500, message: '该用户名已经注册！' });
    } else {
      if (data.length > 0) {
        res.send({ code: 500, message: '该用户名已经注册！' });
        return
      } else {
        let newName = new User({
          userName: req.body.userName,
          passWord: req.body.passWord
        });
        newName.save((err, data) => {
          if (err) {
            res.send({ code: 400, message: '注册失败！', data: err });
          } else {
            res.send({ code: 200, message: '注册成功!' });
          }
        });
      }
    }
  })
})
const auth = async (req, res, next) => {
  let { id } = jwt.verify(req.get("Set-Token"), "lyhq")
  req.userId = id
  next()
}
// 登录接口
router.post('/user/login', (req, res) => {
  User.find({ userName: req.body.userName }, (err, data) => {
    if (err) {
      res.send({ code: 500, message: '查询数据库失败!', data: err });
    } else {
      console.log('data: ', data);
      if (data.length > 0) {
        if (data[0].passWord === req.body.passWord) {
          let token = jwt.sign({ id: data[0]._id }, "lyhq", {
            expiresIn: 60 * 30 * 3  // 0.5小时过期
          });
          res.send({ code: 200, message: '登录成功!', data: { userInfo: data[0].userName, token } })
        } else {
          res.send({ code: 401, message: '密码错误!', data: err });
        }
      } else {
        res.send({ code: 401, message: '登录失败，该用户没有注册!', data: err });
      }
    }
  });
});

router.post('/user/list', auth, async (req, res) => {
  Cookie.find({ userId: req.userId }, (err, data) => {
    res.send({ code: 200, data, message: '操作成功' })
  })

});
router.post('/user/tentVideo', auth, async (req, res) => {
  console.log(req.userId)
  let cookieSava = new Cookie({
    userId: req.userId,
    videoCookie: {
      Cookie: req.body.Cookie,
      loginUrl: req.body.loginUrl,
    },
    desc: req.body.desc,
    ftqq: req.body.ftqq,
    type: 1
  });
  cookieSava.save((err, data) => {
    if (err) {
      res.send({ code: 400, message: '保存失败！', data: err });
    } else {
      res.send({ code: 200, message: '保存成功!' });
    }
  });
});
router.post('/user/deleteList', auth, async (req, res) => {
  Cookie.deleteOne({ userId: req.userId, _id: req.body.id }, (err, data) => {
    if (err) {
      res.send({ code: 500, message: '删除失败' })
    } else {
      res.send({ code: 200, message: '操作成功' })
    }
  })

});
router.post('/select', auth, async (req, res) => {
  Cookie.findOne({ userId: req.userId, _id: req.body.id }, (err, data) => {
    if (err) {
      res.send({ code: 500, message: '查询失败' })
    } else {
      if (data.type == 2) {
        res.send({
          code: 200, message: '操作成功', data: {
            SessionKey: data.panCookie.header.SessionKey,
            Signature: data.panCookie.header.Signature,
            Date: data.panCookie.header.Date,
            Cookie: data.panCookie.COOKIE_LOGIN_USER,
            ftqq: data.ftqq,
            desc: data.desc
          }
        })
      } else {
        res.send({
          code: 200, message: '操作成功', data: {
            Cookie: data.videoCookie.Cookie,
            loginUrl: data.videoCookie.loginUrl,
            ftqq: data.ftqq,
            desc: data.desc
          }
        })
      }

    }
  })
});

router.post('/updata/video', auth, async (req, res) => {
  console.log(req.body)
  Cookie.updateOne({ _id: req.body.id }, {
    videoCookie: {
      Cookie: req.body.Cookie,
      loginUrl: req.body.loginUrl,
    },
    desc: req.body.desc,
    ftqq: req.body.ftqq,
    status: 2,
  }, (err, data) => {
    console.log(data)
    if (err) {
      res.send({ code: 500, message: '编辑失败' })
    } else {
      res.send({ code: 200, message: '操作成功' })
    }
  })


});
router.post('/updata/pan', auth, async (req, res) => {
  Cookie.updateOne({ userId: req.userId, _id: req.body.id }, {
    userId: req.userId,
    panCookie: {
      header: {
        SessionKey: req.body.SessionKey,
        Signature: req.body.Signature,
        Date: req.body.Date
      },
      COOKIE_LOGIN_USER: req.body.Cookie,
    },
    status: 2,
    ftqq: req.body.ftqq,
    desc: req.body.desc,
  }, (err, data) => {
    if (err) {
      res.send({ code: 500, message: '编辑失败' })
    } else {
      res.send({ code: 200, message: '操作成功' })
    }
  })

});
router.post('/user/pan', auth, async (req, res) => {
  let cookieSava = new Cookie({
    userId: req.userId,
    panCookie: {
      header: {
        SessionKey: req.body.SessionKey,
        Signature: req.body.Signature,
        Date: req.body.Date
      },
      COOKIE_LOGIN_USER: req.body.Cookie,
    },
    ftqq: req.body.ftqq,
    desc: req.body.desc,
    type: 2
  });
  cookieSava.save((err, data) => {
    if (err) {
      res.send({ code: 400, message: '保存失败！', data: err });
    } else {
      res.send({ code: 200, message: '保存成功!' });
    }
  });

});

module.exports = router;