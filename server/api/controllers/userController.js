'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('Users');

exports.createUser = function (req, res) {
    let newUser = new User(req.body);
    console.log(req.body.name)
    newUser.save(function (err, user) {
        if (err)
            return res.status(400).send({"description": "Invalid data or server may be down.", err})
        console.log(user)
        return res.status(201).send(user);
    });
};

exports.listAllUsers = function (req, res) {
    User.find({}, function (err, users) {
        if (err)
            return res.status(500).send(err);
        res.json(users);
    });
};

exports.getUser = function (req, res) {
    User.findById(req.params.userId, function (err, user) {
        if (err)
            return res.status(400).send({"description": "Invalid resource identifier or server may be down.", err})
        else if (!user)
            return res.status(404).send();
        return res.json(user);
    });
};