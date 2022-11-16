const router = require('express').Router()
const authMidle = require("../middlewares/auth.middlewares")
const userController = require("../controllers/user.controller")
router.get('/register', userController.getRegister)


router.get('/login', userController.getLogin)

router.post('/register', userController.postRegister)
router.post('/login', userController.postLogin)
router.get('/list', userController.list)
// router.get('/list' , userController.list)
router.get('/form', userController.form)
router.post('/form', userController.crForm)
router.get('/home', userController.home)
router.post('/refresh',authMidle.isAuth, userController.refreshToken)

module.exports = router
