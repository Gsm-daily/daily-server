const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

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

        module.exports = {receiverEmail};

    }catch(err){
        console.log(err);
    }
})


const authNumberCompare = async(req,res) => {

    const auth_number = req.body.auth_number;

    if(parseInt(auth_number) === authNumber){
        console.log('인증 완료!');
        res.status(200);
    }else{
        console.log("비밀번호 틀림");
    }
}

router.post('/auth/compare', authNumberCompare);


module.exports = router;
module.exports = {receiverEmail, authNumberCompare};