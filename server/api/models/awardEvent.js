'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AwardSchema = new Schema({
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
    pic: {
        type: String,
        default: 'https://static7.depositphotos.com/1226177/727/v/450/depositphotos_7279742-stock-illustration-open-and-closed-movie-clapper.jpg',
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Categories',
    }],

    creationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('AwardEvents', AwardSchema);