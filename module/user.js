const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    userName: { type: String },
    passWord: { type: String },
})
const CookieSchema = mongoose.Schema({
    userId: { type: String },
    videoCookie: { type: Object },
    desc: { type: String },
    /**
     * type 1腾讯视频
     * 2 天翼云
     */
    type: { type: Number },
    /**
     * status -1 失效
     * status 1 正常
     * status 2 待校验
     */
    status: { type: Number, default: 2 },
    /**
     * server酱密钥
     */
    ftqq: { type: String },
    panCookie: { type: Object }
})
const User = mongoose.model('user', UserSchema)
const Cookie = mongoose.model('Cookie', CookieSchema)
module.exports = { User, Cookie }