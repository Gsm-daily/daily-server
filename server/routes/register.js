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
        
    const param = [req.body.id, req.body.pw, req.body.nickname];
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

        db.query('SELECT * FROM test1 WHERE id=?', param[0], (err, row) => {
            db.query('SELECT * FROM test1 WHERE nickname=?', param[2], (err, row_name)=>{

            if(row.length === 0 && row_name.length === 0){
                console.log("아이디 & 닉네임 사용가능");
                bcrypt.hash(param[1], saltRounds, (err, hash)=>{
                    param[1] = hash;
                    db.query('UPDATE test1 SET id=?, pw=?, nickname=? WHERE id IS NULL AND pw IS NULL AND nickname IS NULL', param, (err, row)=>{
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

router.get('/register', (req,res)=>{
    res.render("test.ejs");
})
router.post('/register', register);

module.exports = router;