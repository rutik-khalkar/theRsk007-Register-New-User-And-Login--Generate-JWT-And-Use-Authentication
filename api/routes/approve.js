const express = require('express');
const router = express.Router();
const OTP = require('../model/otp');
require('dotenv').config();
 

router.post('/', async(req, res, next) => {
    if(req.body.otpCode == ''){
        res.status(203).json('Please enter OTP')
    }
    else{
        const newOTP = await OTP.findOne({code:req.body.otpCode});
        if(newOTP){
          let currentTime = new Date().getTime();
          let diff =  newOTP.expireIn - currentTime;
          if(diff <  0){
            res.status(203).json('OTP Expired!')
          }
        else{
            res.status(200).json('OTP matched! Login success')
        }
        }
        else{
          res.status(203).json('OTP not match')
        }
    }
})


module.exports = router;