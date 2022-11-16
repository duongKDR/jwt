const jwt = require('jsonwebtoken');

exports.generateToken = async (payload, secretSignature, tokenLife) => {
	try {
		return jwt.sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			}
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
};


exports.refToken = async (payload, secretSignature, refreshLife ) => {
	try {
		return jwt.sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: refreshLife,
			}
		);
	} catch (error) {
		console.log(`Error in ref access token:  + ${error}`);
		return null;
	}
};
exports.verifyToken = async (token, secretKey) => {
	console.log(token,secretKey);
	try {
		//kiem tra tw
		return jwt.verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return null;
	}
};
exports.decoToken =  async ( token , secretKey ) => {
	try {
		
		return jwt.decode(token, secretKey);
	} catch (error) {
		
		return null;
		
	}
}