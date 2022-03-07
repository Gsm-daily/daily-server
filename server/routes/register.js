const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const { application } = require('express');
const saltRounds = 10;
const app = express();
const { receiverEmail } = require('./email'); 

require('dotenv').config();

app.set('view engine', 'ejs');

//회원가입
const register = async (req,res,next)=>{
        
    const param = [req.body.id, req.body.pw, req.body.nickname, req.body.email];
    //아이디 중복 검사
    

    try{

        // if(param[0].length === 0){
        //     return res.status(401).json({ success: false, errormessage: '아이디가 입력되지 않았습니다.' });
        // }
        // if(param[1].length === 0){
        //     return res.status(401).json({ success: false, errormessage: '패스워드가 입력되지 않았습니다.' });
        // }
        // if(param[2].length === 0){
        //     return res.status(401).json({ success: false, errormessage: '닉네임이 입력되지 않았습니다.' });
        // }

        db.query('SELECT * FROM member WHERE id=?', param[0], (err, row) => {
            db.query('SELECT * FROM member WHERE nickname=?', param[2], (err, row_name)=>{

            if(row.length === 0 && row_name.length === 0){
                console.log("아이디 & 닉네임 사용가능");
                bcrypt.hash(param[1], saltRounds, (err, hash)=>{
                    param[1] = hash;
                    db.query('INSERT INTO member (`id`, `pw`, `nickname`, `email`) VALUES (?, ?, ?, ?)', param, (err, row)=>{
                        if(err) console.log(err);
                        console.log('db에 저장됨');
                        console.log('회원가입 완료');
                        res.status(200);
                        res.end();
                })       
            })
            }else if(row.length !== 0 && row_name.length === 0){
                res.status(401).json({ success: false, errormessage: '중복된 아이디 입니다.' });//아이디 중복
                console.log("중복 된 아이디");

            }else if(row.length === 0 && row_name.length !== 0){
                res.status(401).json({ success: false, errormessage: '중복된 닉네임 입니다.' });//닉네임 중복
                console.log("중복 된 닉네임");

            }else if(row.length !== 0 && row_name.length !== 0){
                console.log('아이디, 닉네임 모두 중복입니다.')
                res.status(401);
            }
        })
    })
        }catch(err){
            console.log(err);
    }

  
}

// //인증번호 발급
// const authNumber = Math.floor(Math.random() * 100000 ) + 1;

// //이메일 인증
// const mail = async (req, res)=>{

//     const receiverEmail = req.body.email;

//     try{

//         const transport = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.EMAIL_PW,
//             },
//         });

//         const mailOptions = {
//             from : process.env.EMAIL,
//             to : receiverEmail,
//             subject : "test",
//             text: '오른쪽 인증번호를 입력해주세요 ' + authNumber,
//         };

//         transport.sendMail(mailOptions, (error, info) => {
//             if(error){
//                 console.log(error);
//                 return;
//             }
            
//             console.log(info);
//             console.log('success!');
//         })

//         module.exports = {receiverEmail};

//     }catch(err){
//         console.log(err);
//     }
// }

// const authNumberCompare = async(req,res) => {

//     const auth_number = req.body.auth_number;

//     if(parseInt(auth_number) === authNumber){
//         console.log('인증 완료!');
//         res.status(200)
//     }else{
//         console.log("비밀번호 틀림");
//     }
// }



router.get('/register', (req,res)=>{
    res.render("test.ejs");
})
router.post('/register', register);
// router.post('/auth', mail);
// router.post('/auth/compare', authNumberCompare);

module.exports = router;