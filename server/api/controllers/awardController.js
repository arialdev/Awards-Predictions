'use strict';
const mongoose = require('mongoose');
const Award = mongoose.model('AwardEvents');

exports.createAwardEvent = function (req, res) {
    let newAward = new Award(req.body);
    newAward.save(function (err, award) {
        if (err)
            res.send(err);
        res.json(award);
    });
};

exports.listAllAwards = function (req, res) {
    Award.find({}, function (err, awards) {
        if (err)
            res.send(err);
        res.json(awards);
    });
};

exports.getAward = function (req, res) {
    Award.findById(req.params.awardId, function (err, award) {
        if (err)
            res.send(err);
        res.json(award);
    });
};