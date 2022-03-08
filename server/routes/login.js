const express = require('express');
const db = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookiePaser = require('cookie-parser');
const { verifyToken } = require('./midlewares');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;


router.get('/login',(req,res,next)=>{
    res.render('login.ejs');
})

router.post('/login', (req, res, next) => {
    param1 = [req.body.id, req.body.pw];

    db.query('SELECT * FROM test1 WHERE id=?', param1[0], (err, row) => {
        if (err) console.log(err);

        if (row.length > 0) {
            bcrypt.compare(param1[1], row[0].pw, (err, result)=> {
            if (result) {
                console.log('로그인 성공');
                res.status(200);

                //토큰 발급
                const Token = jwt.sign({
                    id : param1[0],
                    nickname : row[0].nickname,
                    iss : 'daily'
                },jwtSecret,{
                    expiresIn : 60 * 60,
                });

                return res.status(200).json({
                    msg : '로그인 성공',
                    token : Token,
                });

            } else {
                console.log('로그인 실패');
                res.status(401).json({ success: false, errormessage: 'pw is not match' });
            }
        })
        } else {
            console.log('아이디가 존재하지 않습니다.');
            res.status(401).json({ success: false, errormessage: 'id is null' });
            }
        })
    })

module.exports = router;