'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('Users');

exports.createUser = function (req, res) {
    let newUser = new User(req.body);
    newUser.save(function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.listAllUsers = function (req, res) {
    User.find({}, function (err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
};

//TODO: Códigos de error
exports.getUser = function (req, res) {
    User.findById(req.params.userId, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};