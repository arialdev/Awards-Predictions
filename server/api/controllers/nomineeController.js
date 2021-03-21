'use strict';
const mongoose = require('mongoose');
const Category = mongoose.model('Categories');
const Nominee = mongoose.model('Nominees');

exports.createNominee = async function (req, res) {
    let newNominee = new Nominee(req.body);
    newNominee.save(async function (err, nominee) {
        if (err)
            return res.status(400).send({"description": "Invalid data or server may be down.", err})
        let category = await Category.findByIdAndUpdate(req.params.categoryId, {$push: {nominees: newNominee}}, {new: true})
        if (!category) return res.status(404).send();
        return res.status(201).json(nominee);
    });
};

exports.listAllNominees = function (req, res) {
    Category.findById(req.params.categoryId, function (err, category) {
        if (err)
            return res.status(400).send(err);
        return res.json(category.nominees);
    });
};

exports.getNominee = function (req, res) {
    Nominee.findById(req.params.nomineeId, function (err, nominee) {
        if (err)
            return res.status(500).send(err);
        if (!nominee)
            return res.status(404).send();
        return res.json(nominee);
    });
};

exports.getNomineePicture = async function (req, res) {
    try {
        const nominee = await Nominee.findById(req.params.nomineeId);
        if (!nominee) return res.status(404).json({message: 'Nominee not found'});
        let a = nominee.pic;
        const options = {
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
            }
        }
        res.sendFile((nominee.pic == "#") ? `${appRoot}/assets/data/nominees/no-picture.jpg` : nominee.pic,
            options, function (error) {
                if (error) {
                    console.error("An error ocurren when sending data".bgRed, error);
                    res.status(500).json({message: 'Something went wrong at sending the nominee picture', error});
                }
            })

    } catch (e) {
        return res.status(500).send();
    }
};