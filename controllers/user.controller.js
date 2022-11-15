var jwt = require('jsonwebtoken');
const userModel = require("../models/userModel")
const postModel = require("../models/post")
const bcrypt = require("bcrypt");
const { role, ROLES } = require('../models/index');

var refreshTokens = {};
const auth = require("../middlewares/checkAu")

const CheckToken = require("../middlewares/checkToken")
const authAdmin = require("../middlewares/checkAdmin")
const userAuth = require("../middlewares/checkUser");
const e = require('cors');


exports.getRegister = (req, res, next) => {
   
    res.render("register");
};
exports.getLogin = (req, res, next) => {
  
    res.render("login");
};

exports.postRegister = async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.json(" vui long nhap lai")
        }

        const { username, password } = req.body
        const user = await userModel.findOne({ username })
        if (user) return res.status(400).json({ msg: " Username da tồn tại" })

        const hashPassword = bcrypt.hashSync(req.body.password, 10);

        let isvalid = ROLES.indexOf(req.body.role);
        console.log("isvalid : " + isvalid);
        if (isvalid > 2) {
            return res.json(500).message("Role is not found.");
        }

        console.log(req.body);

        let registerRequestModel = new userModel({
            username: req.body.username,
            password: hashPassword,
            role: req.body.role

        })
        let result = await registerRequestModel.save()
        // res.json(result)
        return res.send("Đăng kí thành công!");

    } catch (error) {
        res.status(500).send(error.message)
    }
};

exports.postLogin = async (req, res, next) => {
    try {

        console.log( "goi ham login");
        
        const { username, password } = req.body
        console.log( req)
        console.log("==> '" + username + "'");
        const user = await userModel.findOne({ username })
        if (!user) return res.status(400).json({ msg: " Username ko tồn tại" })
 
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Mật khẩu sai" })

        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

        const dataForAccessToken = {
            username: user.username,
            role: user.role,

        };
        const conF = {
            username: user.username,
            role: user.role,
        };

        const accessToken = await auth.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(401)
                .send(' loi vui lòng thử lại sau.');
        }

        let refreshToken = auth.refToken(
            conF,
            accessTokenSecret,
            refreshTokenLife

        );
        if (!user.refreshToken) {
            // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            // await userModel.updateRefreshToken(user.username, refreshToken);
        } else {
            // Nếu user này đã có refresh token thì lấy refresh token đó từ database
            refreshToken = user.refreshToken;
        }
        // if (user.role == "admin") {
        //     const users = await userModel.find();
        //     const options = {
        //         expires: new Date(
        //             Date.now() + 2 * 24 * 60 * 60 * 1000
        //         ),
        //         httpOnly: true
        //     };
        //     res.cookie("token", accessToken, options).render('list', {
        //         users,
        //     })
        //     console.log("-----------------");

        //     res.end();


        // }
        // return res.status(200).cookie("token", accessToken, { expire: new Date(3600 + Date.now()) }).redirect('post')
        // //    .clearCookie('username')


        console.log( "goi ham login ok");
        return res.json({
            msg: 'Đăng nhập thành công.',
            accessToken,
            refreshToken,
            user,
        });
      

    } catch (error) {
        console.log(error);
        // res.status(500).send(error.message)
    }
};
async function handler (req, res) {
    console.log( "hello")
    

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


let token = req.headers.authorization.replace("Bearer ","");





console.log(req.headers);
const data  = await auth.decoToken(token,accessTokenSecret)
console.log( data);
console.log(token);
    }
  
exports.hello = async (req, res) => {
    // console.log( "hello")
    
    // const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


    // let token = req.headers.authorization.replace("Bearer ","");
    // console.log(req.headers);
    // const data  = await auth.decoToken(token,accessTokenSecret)
    // console.log( data);
    // console.log(token);
    // console.log(data.payload.role)
    // asyncCall()
    handler();
    if(data.payload.role == "admin") {
        const users = await userModel.find();
        const options = {
            expires: new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
        res.cookie("token", token, options).render('list', {
                    users,
                }) 
        console.log("-----------------");
        // form = async (req, res) => {
        //    res.render('form') 
        // }
            console.log( "hello")
        res.end();
        
    }else{
        res.status(401)
			.send('Bạn không có quyền truy cập vào tính năng này!');
    }
    res.status(200);
} 


// exports.list = async(req, res) => {
//     asyncCall()
//     if(data.payload.role == "admin") {
//         const users = await userModel.find();
//         const options = {
//             expires: new Date(
//                 Date.now() + 2 * 24 * 60 * 60 * 1000
//             ),
//             httpOnly: true
//         };
//         res.cookie("token", token, options).render('list', {
//         users,
//     }) 
// }
// exports.form = async(req, res) =>{
//     const data  = await auth.decoToken(token,accessTokenSecret)
//     if(data.payload.role == "admin") {
//         console.log(data.payload.role);
//     }
// }
