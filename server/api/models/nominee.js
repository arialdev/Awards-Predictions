'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NomineeSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the nominee'
    },
    pic: {
        type: String,
        default: "https://static7.depositphotos.com/1226177/727/v/450/depositphotos_7279742-stock-illustration-open-and-closed-movie-clapper.jpg"
    },
    movie: {
        type: String,
        required: 'Kindly enter the name of the belonged movie'
    },
    link: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: 'To which category belongs this nominee?'
    },
    award: {
        type: Schema.Types.ObjectId,
        ref: 'AwardEvents',
        required: 'To which Award Event belongs this nominee?'
    },
    votes: {
        type: Number,
        default: 0,
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Nominees', NomineeSchema);