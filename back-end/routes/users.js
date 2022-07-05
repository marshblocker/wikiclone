var express = require('express');

const userController = require('../controllers/user/userController');
const utils = require('../utils');

var router = express.Router();

router.post('/', (req, res) => userController.userCreateController.createUser(req, res));

router.get('/', (req, res) => userController.userReadController.readAllUsersInfo(req, res));
router.get('/:user_id/info', (req, res) => userController.userReadController.readUserInfo(req, res));

router.use(utils.parseToken);

router.get('/current', (req, res) => userController.userReadController.readCurrentUserInfo(req, res));
router.get('/:user_id/password_hash', (req, res) => userController.userReadController.readUserPasswordHash(req, res));

router.patch('/:user_id/username', (req, res) => userController.userUpdateController.updateUserName(req, res));
router.patch('/:user_id/password', (req, res) => userController.userUpdateController.updatePassword(req, res));
router.patch('/:user_id/email', (req, res) => userController.userUpdateController.updateEmail(req, res));
router.patch('/:user_id/role', (req, res) => userController.userUpdateController.updateRole(req, res));
router.patch('/:user_id/can_edit', (req, res) => userController.userUpdateController.updateCanEdit(req, res));

router.delete('/:user_id', (req, res) => userController.userDeleteController.deleteUser(req, res));

module.exports = router;
