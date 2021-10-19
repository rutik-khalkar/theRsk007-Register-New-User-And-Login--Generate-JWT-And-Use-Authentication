const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router()
const userRegister = require('../model/user') 

// Login user
router.post('/', async (req, res, next) => {
    
    //login logic start
    try{
        //get user input
        const { email, password } = req.body;

        //validate user input
        if(!(email && password)) {
            res.status(400).send('All input field is requried!');
        }

        //validate if user exist in database
        const user = await userRegister.findOne({ email });

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
                message : 'User login successfully!',
                email,
                token
            });
        }
        else
        {
            res.status(400).send("Invalid Credentials")
        }
    }
    catch(err){
        console.log(err)
    }
    //login logic end
});

module.exports = router