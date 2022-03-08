const nodemailer = require('nodemailer');
const express = require('express');
const { promise, reject } = require('bcrypt/promises');
const router = express.Router();
const db = require('../config/db')
require('dotenv').config();

const authNumber = Math.floor(Math.random() * 100000 ) + 10001;

//이메일 인증
router.post('/auth', async (req, res)=>{

    const receiverEmail = req.body.email;

    if(receiverEmail.length === 0){
        res.redirect('/user/register');
        res.status(401);
        
    }else{

        try{
            const transport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PW,
                },
            });
    
            const mailOptions = {
                from : process.env.EMAIL,
                to : receiverEmail,
                subject : "test",
                text: '오른쪽 인증번호를 입력해주세요 ' + authNumber,
            };
    
            transport.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.log(error);
                }
                // console.log(info);
                console.log('success!');
            })
    
            db.query('INSERT INTO test1 (`email`) VALUES (?)', receiverEmail, (err, row)=>{
                console.log(receiverEmail + " 이메일 db에 저장 완료");
            });
            
            //res.redirect('/user/register');
        }catch(err){
            console.log(err);
        }
    }  
})

const authNumberCompare = ((req, res)=>{

    const auth_number = req.body.auth_number;

    if (parseInt(auth_number) === authNumber) {
        console.log('인증 완료!');
        res.status(200);

    } else {
        console.log("비밀번호 틀림");
    }
}) 

router.post('/auth/compare', authNumberCompare);

module.exports = router;