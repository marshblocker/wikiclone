var express = require('express');
const LoginController = require('../controllers/login/LoginController');
const UserReadController = require('../controllers/user/UserReadController');
const UserDAO = require('../DAO/UserDAO');
const userReadController = new UserReadController(new UserDAO());
var router = express.Router();

const loginController = new LoginController(userReadController);

router.post('/', async (req, res) => await loginController.loginUser(req, res));

module.exports = router;