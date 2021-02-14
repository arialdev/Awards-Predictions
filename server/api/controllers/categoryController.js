'use strict';
const mongoose = require('mongoose');
const Category = mongoose.model('Categories');
const Award = mongoose.model('AwardEvents');

exports.createCategory = async function (req, res) {
    let newCategory = new Category(req.body);
    newCategory.save(async function (err, category) {
        if (err)
            return res.status(400).send({"description": "Invalid data or server may be down.", err})
        let award = await Award.findByIdAndUpdate(req.params.awardId, {$push: {categories: newCategory}}, {new: true})
        if (!award) return res.status(404).send();
        return res.status(201).json(category);
    });
};

exports.listAllCategories = function (req, res) {
    Award.findById(req.params.awardId, function (err, award) {
        if (err)
            return res.status(400).send(err);
        return res.json(award.categories);
    });
};

exports.getCategory = function (req, res) {
    Category.findById(req.params.categoryId, function (err, category) {
        if (err)
            return res.status(500).send(err);
        if (!category)
            return res.status(404).send();
        return res.json(category);
    });
};

exports.setWinner = async function (req, res) {
    let category = await Category.findByIdAndUpdate(req.params.categoryId,
        {$push: {winner: req.params.nomineeId}}, {new: true});
    if (!category) return res.status(404).send();
    return res.json(category);
};