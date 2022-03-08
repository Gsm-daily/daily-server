const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const register = require('./routes/register');
const login = require('./routes/login');
const email = require('./routes/email');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/user', register, login);
app.use('/user', email);

const ip = '10.120.74.59';
app.listen(3000, function(){
    console.log("서버 실행중");
})