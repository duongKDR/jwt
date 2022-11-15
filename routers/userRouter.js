const router = require('express').Router()

const userController = require("../controllers/user.controller")
router.get('/register', userController.getRegister)


router.get('/login', userController.getLogin)

router.post('/register', userController.postRegister)
router.post('/login', userController.postLogin
)
router.get('/list', userController.list)
// router.get('/list' , userController.list)
router.get('/form', userController.form)
router.post('/form', userController.crForm)
module.exports = router
