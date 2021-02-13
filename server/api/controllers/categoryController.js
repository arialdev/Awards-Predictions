'use strict';
const mongoose = require('mongoose');
const Category = mongoose.model('CategoryEvents');
const Award = mongoose.model('AwardEvents');

exports.createCategory = function (req, res) {
    let newCategory = new Category(req.body);
    Award.findById(req.params.awardId, function (err, award) {
        if (err)
            res.send(err);
        res.categories.push(newCategory)
        res.save(function (err, category) {
            if (err)
                res.send(err);
            res.json(category);
        });
    })
};

exports.listAllCategories = function (req, res) {
    Award.findById(req.params.awardId, function (err, award) {
        if (err)
            res.send(err);
        res.json(award.categories);
    });
};

exports.getCategory = function (req, res) {
    Category.findById(req.params.categoryId, function (err, category) {
        if (err)
            res.send(err);
        res.json(category);
    });
};