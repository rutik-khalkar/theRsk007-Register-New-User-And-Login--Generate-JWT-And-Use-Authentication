const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


// a welcome route with authentication is requried
router.get('/', auth, (req, res) => {
    res.status(200).send('Welcome to JWT...!!!')
})

module.exports = router;