'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AwardSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: 'Please, enter a valid username',
    },
    year: {
        type: Number,
        required: 'Please, enter the event\'s year',
    },
    edition: {
        type: Number,
        default: 1,
    },

    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Categories',
    }],

    Created_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('AwardEvents', AwardSchema);