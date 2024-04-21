var jwt = require('jsonwebtoken');
const userModel = require("../models/userModel")
const postModel = require("../models/post")

const bcrypt = require("bcrypt");
const { role, ROLES } = require('../models/role');
var refreshToken = {};
const auth = require("../middlewares/checkAu")
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

        const { username, password, fullname,email} = req.body
        const user = await userModel.findOne({ username })
        if (user) return res.status(400).json({ msg: " Username da tồn tại" })

        const hashPassword = bcrypt.hashSync(req.body.password, 10);

        let isvalid = ROLES.indexOf(req.body.role);
        console.log("isvalid : " + isvalid);
        if (isvalid > 2) {
            return res.json(500).message("Role is not found.");
        }

        // console.log(req.body);

        let registerRequestModel = new userModel({
            fullname:req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            role: req.body.role

        })
        let result =  registerRequestModel.save()
        // res.json(result)
        return res.send("Đăng kí thành công!");

    } catch (error) {
        res.status(500).send(error.message)
    }
};

exports.postLogin = async (req, res, next) => {
    try {

        console.log("goi ham login");

        const { username, password } = req.body
        // console.log(req)
        console.log("==> '" + username + "'");
        const user = await userModel.findOne({ username })
        if (!user) return res.status(400).json({ msg: " Username ko tồn tại" })

        const isMatch = await  bcrypt.compare(password, user.password)
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

        let refreshToken = await auth.refToken(
            conF,
            accessTokenSecret,
            refreshTokenLife

        );

        const option1 = {
            accessTokenLife,
            httpOnly: true
        };
        const option2 = {
            refreshTokenLife,
            httpOnly: true
        };

       
        // console.log("goi ham login ok");
        return res.cookie("REtoken", refreshToken ,option2 ).cookie("token", accessToken,option1 ).json({
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
async function check(req, res) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    let token = req.headers.authorization.replace("Bearer ", "");
    let verify = await auth.verifyToken(token, accessTokenSecret)
    if (verify == null) {
        return null;
    }
    let data = await auth.decoToken(token, accessTokenSecret)
    // console.log(data);
    return data;
}
exports.list = async(req,res) => {
//    const data =  [
//         { alertCount: 5 },
//         { CaseResolvedCount: 1, caseOpenCount: 1 },
//         { caseFalsePositiveCount: 1 },
//         { caseCount: 2 }]

// //  let re = new postSchema ({
// //     data: data
// // });
//     // await re.save()
//     const lastData = await postSchema.find().sort({ timestampField: -1 }).limit(1);

//     let newE = [
//      ...   lastData[0].data,
      
//     ]
//     newE.polarAreaChartStatisticCase = lastData[0].data[0]
//     console.log("lấn",newE);
    
//     return res.status(200).send(newE)
}
exports.list = async (req, res) => {

    var data = await check(req, res);
    if (data == null) {
        console.log("loi sai")
        return res.status(401).send("da het han token")

    }
    let token = req.headers.authorization.replace("Bearer ", "");

    if (data.payload.role == "admin") {
        const users = await userModel.find();
        const options = {
            expires: new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
        console.log(refreshToken)
        res.cookie("token", token,"reftoken", refreshToken, options).render('list', {
            users,
        })
        console.log("-----------------");

        console.log("hello")
        res.end();

    } else {
        res.status(401)
            .send('Bạn không có quyền truy cập vào tính năng này!');
    }
    res.status(200);
}


exports.form = async (req, res) => {
    var data = await check(req, res);
    if (data == null) {
        console.log("loi sai")
        return res.status(401).send("da het han token")

    }
    let token = req.headers.authorization.replace("Bearer ", "");

    if (data.payload.role == "admin") {

        const options = {
            expires: new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
            )
        };
        res.cookie("token", token,"reftoken", refreshToken,options).render('form')
        console.log("-----------------")
        console.log("form")
        res.end();

    } else {
        res.status(401)
            .send('Bạn không có quyền truy cập vào tính năng này!');
    }
    res.status(200);


}

exports.crForm = async (req, res) => {
    try {
        if (!req.body.title || !req.body.content || !req.body.description) {
            return res.json(" vui long nhap lai")
        }

        const { title } = req.body
        const name = await postModel.findOne({ title })
        if (name) return res.status(400).json({ msg: " Name da tồn tại" })


        // let formRequestModel = new postModel({
        //     username: req.body.username,
        //     password: hashPassword,
        //     role: req.body.role

        // })
        return res.send("Đăng thành công!");

    } catch (error) {
        res.status(500).send(error.message)
    }
}
exports.home = async( req,res) => {
    var data = await check(req, res);
    if (data == null) {
        console.log("loi sai")
        return res.status(401).send("da het han token")

    }
 

    const user = await userModel.findOne({ username:data.payload.username });
    
    res.json(user)

}
exports.refreshToken = async (req, res) => {

    const user = userModel.findOne({ username: req.user.username });
    if (!user) {
        return res.status(401).send('User ko ton tai');

    }


    const dataForAccessToken = {
        username: user.username,
        role: user.role,
    };
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    const accessToken = await auth.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );

    if (!accessToken) {
        return res
            .status(400)
            .send('Tạo access token không thành công, vui lòng thử lại.');
    }
    return res.json({
        accessToken,
    });
}


