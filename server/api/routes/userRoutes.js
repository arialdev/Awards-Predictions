'use strict';
module.exports = function (app) {
    const users = require('../controllers/userController');

    // user Routes
    app.route('/users')
        .get(users.listAllUsers)
        .post(users.createUser);


    app.route('/users/:userId')
        .get(users.getUser)
};