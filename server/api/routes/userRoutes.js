'use strict';
module.exports = function (app) {
    const users = require('../controllers/userController');

    // user Routes
    app.route('/awardsPredictions/users')
        .get(users.listAllUsers)
        .post(users.createUser);


    app.route('/awardsPredictions/users/:userId')
        .get(users.getUser)
};