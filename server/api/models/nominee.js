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
    Created_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Nominees', NomineeSchema);