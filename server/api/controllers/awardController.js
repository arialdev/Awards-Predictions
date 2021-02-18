'use strict';
const mongoose = require('mongoose');
const Award = mongoose.model('AwardEvents');

exports.createAwardEvent = function (req, res) {
    let newAward = new Award(req.body);
    newAward.save(function (err, award) {
        if (err)
            return res.status(400).send({"description": "Invalid data or server may be down.", err})
        return res.status(201).json(award);
    });
};

exports.findAwardEventByNameAndEdition = function (req, res) {

    const name = req.params.awardEventName;
    const edition = req.params.awardEdition;

    Award.findOne({name, edition}, function (err, award) {
        if (err)
            return res.status(400).send(err);
        else if (!award)
            return res.status(404).send();
        res.json(award);
    });
};

exports.listAllAwards = function (req, res) {
    Award.find({}, function (err, awards) {
        if (err)
            return res.status(500).send(err);
        res.json(awards);
    });
};

exports.getAward = function (req, res) {
    Award.findById(req.params.awardId, function (err, award) {
        if (err)
            return res.status(400).send({"description": "Invalid resource identifier or server may be down.", err})
        else if (!award)
            return res.status(404).send();
        return res.json(award).send();
    });
};