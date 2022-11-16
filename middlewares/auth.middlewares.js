
var jwt = require('jsonwebtoken');
const userModel = require("../models/userModel")

const auth = require("./checkAu")


exports.isAuth = async (req, res, next) => {
	// Lấy access token từ header
	// const token = req.headers.authorization.replace("Bearer ", "");
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).send('Không tìm thấy access token!');
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await auth.verifyToken(
		token,
		accessTokenSecret,
	);

	if (!verified) {
		return res
			.status(401)
			.send('het han');
	}
	const user = await userModel.findOne({username: verified.payload.username})
	req.user = user;
	return next();
};
