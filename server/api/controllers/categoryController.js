'use strict';
const mongoose = require('mongoose');
const Category = mongoose.model('Categories');
const Award = mongoose.model('AwardEvents');

// TODO: control de errores
exports.createCategory = async function (req, res) {
    let newCategory = new Category(req.body);
    newCategory.save(async function (err, category) {
        if (err)
            return res.status(400).send({"description": "Invalid data or server may be down.", err})
        await Award.findByIdAndUpdate(req.params.awardId, {$push: {categories: newCategory}}, {new: true})
        return res.status(201).json(category);
    });
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