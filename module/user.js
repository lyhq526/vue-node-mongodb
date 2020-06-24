const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    userName: { type: String },
    passWord: { type: String },
})
const CookieSchema = mongoose.Schema({
    userId: { type: String },
    videoCookie: { type: String },
    desc:{type:String},
    type:{type:String},
    status:{type:Number,default: 2},
    ftqq:{type:String},
})
const User =  mongoose.model('user',UserSchema)
const Cookie =  mongoose.model('Cookie',CookieSchema)
module.exports = {User,Cookie}