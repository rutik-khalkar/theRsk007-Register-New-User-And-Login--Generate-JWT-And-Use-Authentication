const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    email : String,
    code : String,
    expireIn : Number
},{
    timestamps:true
})


module.exports = mongoose.model('otp', otpSchema, 'otp');