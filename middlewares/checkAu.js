const jwt = require('jsonwebtoken');

exports.generateToken = async (payload, secretSignature, tokenLife) => {
	try {
		return await jwt.sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
};


exports.refToken = async (payload, secretSignature, refreshLife ) => {
	try {
		return await jwt.sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: refreshLife,
			},
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
};
exports.verifyToken = async (token, secretKey) => {
	try {
		return await jwt.verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return null;
	}
};
exports.decoToken =  async ( token , secretKey ) => {
	try {
		
		return await jwt.decode( token, secretKey);
	} catch (error) {
		
		return null;
		
	}
}