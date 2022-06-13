var express = require('express');
var router = express.Router();

const userCreateController = require('../controllers/user/userCreateController');
const userReadController = require('../controllers/user/userReadController');
const userUpdateController = require('../controllers/user/userUpdateController');
const userDeleteController = require('../controllers/user/userDeleteController');

// Required body parameters: none.
router.get('/', userReadController.readUsers);

// Required body parameters: none.
// Can append 'attr' query parameter to get a specific attribute value
// of a given user. For example, /users/ABC?attr=username, to get
// the username of the user with user_id ABC.
router.get('/:user_id', userReadController.readUser);

// Required body parameters: 'username', 'password', 'email', 'role'.
router.post('/', userCreateController.createUser);

// Required body parameter (ONLY one of the following): 'username', 'password', 'email', 'role', 'page_id'.
// If 'page_id', the 'contributed_pages' attribute will be appended (if not yet so) with 'page_id'.
router.patch('/:user_id', userUpdateController.updateUser);

// Required body parameters: none.
router.delete('/:user_id', userDeleteController.deleteUser);

module.exports = router;
