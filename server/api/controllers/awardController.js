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

exports.findAwardEventByNameAndEdition = async function (req, res) {
    const name = req.params.awardEventName;
    const edition = req.params.awardEdition;
    try {
        const award = await Award.findOne({name, edition}).populate({
            path: 'categories',
            populate: 'nominees'
        });
        if (!award) return res.status(404).json({message: 'Award Event not found'});
        return res.status(200).json(award);
    } catch (error) {
        return res.status(500).send();
    }
};

exports.listAllAwards = function (req, res) {
    Award.find({}, function (err, awards) {
        if (err)
            return res.status(500).send(err);
        res.json(awards);
    });
};

exports.findAwardById = async function (req, res) {
    try {
        const award = await Award.findById(req.params.awardId).populate({
            path: 'categories',
            populate: 'nominees'
        });
        if (!award) return res.status(404).json({message: 'Award Event not found'});
        return res.status(200).json(award);
    } catch (error) {
        return res.status(500).send();
    }
};