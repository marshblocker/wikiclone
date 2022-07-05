var express = require('express');
const LoginController = require('../controllers/login/LoginController');
const userController = require('../controllers/user/userController');
var router = express.Router();

const loginController = new LoginController(userController.userReadController);

router.post('/', (req, res) => loginController.loginUser(req, res));

module.exports = router;