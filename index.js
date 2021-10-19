const express = require('express');         // import express

require('dotenv').config();               // import dotenv file 
require('./config/database').connect();  //import database file 

const RegisterRoute = require('./api/routes/register');  // import register route
const LoginRoute = require('./api/routes/login');       // import login route
const WelcomeRoute = require('./api/routes/welcome');       // import welcome route

const app = express(); // configure exprss

const { API_PORT } = process.env           // configure PORT
const port = process.env.PORT || API_PORT // use port


app.use(express.json()) // use express

app.use('/register', RegisterRoute);     //use register route
app.use('/login', LoginRoute);  //use login route
app.use('/welcome', WelcomeRoute);  //use welcome route


// run app using port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});