'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the award category'
    },
    nominees: [{
        type: Schema.Types.ObjectId,
        ref: 'Nominees',
        votes: {
            type: Number,
            default: 0,
        }
    }],
    winner: {
        type: Number,
        default: -1,
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Categories', CategorySchema);