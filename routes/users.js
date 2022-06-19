var express = require('express');

const userController = require('../controllers/user/userController');

var router = express.Router();

router.get('/', (req, res) => {
    // This does not necessarily return all the users. The list could be filtered
    // based on the query parameters.
    userController.userReadController.readAllUsers(req.query)
    .then(users => res.status(200).json(users))
    .catch(error => res.status(error.code).json(error.message));
});

router.get('/:user_id', (req, res) => {
    userController.userReadController.readUser(req.params.user_id, req.query)
    .then(user => res.status(200).json(user))
    .catch(error => res.status(error.code).json(error.message));
});

router.post('/', (req, res) => {
    userController.userCreateController.createUser(req.body)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(error.code).json(error.message));
});

router.put('/:user_id', (req, res) => {
    userController.userUpdateController.updateUser(req.params.user_id, req.body)
    .then(user => res.status(200).json(user))
    .catch(error => res.status(error.code).json(error.message));
});

router.delete('/:user_id', (req, res) => {
    userController.userDeleteController.deleteUser(req.params.user_id)
    .then(user => res.status(200).json(user))
    .catch(error => res.status(error.code).json(error.message));
})

module.exports = router;
