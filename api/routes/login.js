const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../model/user')
const OTP = require('../model/otp');
require('dotenv').config();



router.post('/', async(req, res, next) => {
    try{
        const { email, password } = req.body;

        //validate user input
        if(!(email && password)) {
            res.status(400).send('All input field is requried!');
        }
        else{
            //validate if user exist in database
            const data = await Users.findOne({ email });
            // const responseType = {};
            let otpcode = Math.floor((Math.random()*1000000));
            if(data){
                let otpData = new OTP({
                    email : req.body.email,
                    code : otpcode,
                    expireIn : new Date().getTime() + 300*1000
                })
                let otpResponse = await otpData.save();
                
                //validate if user exist in database
                const user = await Users.findOne({ email });

                if (user && (await bcrypt.compare(password, user.password))) {

                    //create login token
                    const token = jwt.sign(
                        {
                            user_id : user._id, email
                        },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn:"2h",
                        }
                    );
                    //save user token
                    user.token = token;
        
                    //loging success message
                    res.status(200).send({
                        message : `User login success!!  Please check your Email-ID OTP has been send!`,
                        email,
                        token
                    });
                }
                else
                {
                    res.status(400).send("Invalid Credentials")
                }
            }
            else{
                
                res.status(400).send('Error! \nYour Email-ID is not exist! Please register!');
            }

            const mail = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user:process.env.USER,
                    pass:process.env.PASSWORD    
                }
            });

            const mailOptions = {
                from: process.env.USER,
                to: data.email,
                subject: `Hii ${data.first_name} your new OTP for login `,
                html: `<h1 style='font-weight:bold; color:#6e0031'>Hey ${data.first_name}</h1>
                <h3>Your accout login success!!<br> Please enter OTP </h3> 
                <h1 style='font-weight:bold; color:#260087;'>${otpcode.toString()}</h1>
                <br><p>Thank You! For using my company</p>`
            };
            
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                }
                else{
                    console.log('Email sent: ' + info.response);
                }
            });
        }

    } 
    catch(err){
        console.log(err)
    }
})



module.exports = router