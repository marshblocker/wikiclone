const UserDAO = require('../../DAO/UserDAO');
const UserReadController = require('./UserReadController');
const UserCreateController = require('./UserCreateController');
const UserUpdateController = require('./UserUpdateController');
const UserDeleteController = require('./UserDeleteController');

class UserController {
    constructor(userReadController, userCreateController, 
                userUpdateController, userDeleteController) {
        this.userReadController = userReadController;
        this.userCreateController = userCreateController;
        this.userUpdateController = userUpdateController;
        this.userDeleteController = userDeleteController;
    }
}

let userDAO = new UserDAO();

let userReadController = new UserReadController(userDAO);
let userCreateController = new UserCreateController(userDAO);
let userUpdateController = new UserUpdateController(userDAO);
let userDeleteController = new UserDeleteController(userDAO);

let userController = new UserController(
    userReadController, userCreateController, 
    userUpdateController, userDeleteController
);

module.exports = userController;