const nodemailer = require('nodemailer');
const express = require('express');
const { promise, reject } = require('bcrypt/promises');
const router = express.Router();
require('dotenv').config();

const authNumber = Math.floor(Math.random() * 100000 ) + 1;

//이메일 인증
router.post('/auth', async (req, res)=>{

    const receiverEmail = req.body.email;

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
                return;
            }
            
            console.log(info);
            console.log('success!');
        })
    }catch(err){
        console.log(err);
    }

    email123(receiverEmail);


    //프로미스로 이메일 보내야 함

    
})

function email123(receiverEmail){
    // return new Promise((resolve, reject)=>{
    //     resolve(receiverEmail);
    //     console.log(receiverEmail);
    // })
    console.log(receiverEmail);
}
// email.then((email)=>{
//     console.log(email)
// })

const authNumberCompare = async(req,res) => {

    const auth_number = req.body.auth_number;

   //console.log(email);


    if(parseInt(auth_number) === authNumber){
        console.log('인증 완료!');
        res.status(200);
    }else{
        console.log("비밀번호 틀림");
    }
}

router.post('/auth/compare', authNumberCompare);


module.exports = router;
