var express = require('express');
const utils = require('../utils');

var router = express.Router();

router.post('/', async (req, res) => await userCreateController.createUser(req, res));

router.get('/', async (req, res) => await userReadController.readAllUsersInfo(req, res));
router.get('/:user_id/info', async (req, res) => await userReadController.readUserInfo(req, res));

router.use(utils.parseToken);

router.get('/current', async (req, res) => await userReadController.readCurrentUserInfo(req, res));
router.get('/:user_id/password_hash', async (req, res) => await userReadController.readUserPasswordHash(req, res));

router.patch('/:user_id/username', async (req, res) => await userUpdateController.updateUserName(req, res));
router.patch('/:user_id/password', async (req, res) => await userUpdateController.updatePassword(req, res));
router.patch('/:user_id/email', async (req, res) => await userUpdateController.updateEmail(req, res));
router.patch('/:user_id/role', async (req, res) => await userUpdateController.updateRole(req, res));
router.patch('/:user_id/can_edit', async (req, res) => await userUpdateController.updateCanEdit(req, res));

router.delete('/:user_id', async (req, res) => await userDeleteController.deleteUser(req, res));

module.exports = router;
