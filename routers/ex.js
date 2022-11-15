const express = require('express');
const router = express.Router();

const auth = require("../middlewares/checkAu")

const isAuth = auth.isAuth;

router.get('/profile', isAuth, async (req, res) => {
	res.send(req.user);
});

module.exports = router;