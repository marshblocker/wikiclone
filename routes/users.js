var express = require('express');

const userController = require('../controllers/user/userController');

var router = express.Router();

// This does not necessarily return all the users. The list could be filtered
// based on the query parameters.
router.get('/', (req, res) => userController.userReadController.readAllUsers(req, res));

router.get('/:user_id', (req, res) => userController.userReadController.readUser(req, res));

router.post('/', (req, res) => userController.userCreateController.createUser(req, res));

router.put('/:user_id', (req, res) => userController.userUpdateController.updateUser(req, res));

router.delete('/:user_id', (req, res) => userController.userDeleteController.deleteUser(req, res));

module.exports = router;
