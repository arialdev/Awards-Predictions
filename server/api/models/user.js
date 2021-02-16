'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: 'Please, enter a valid username',
    },

    email: {
        type: String,
    },

    votes: [{
        awardEvent: {
            type: Schema.Types.ObjectId,
            ref: 'AwardEvents',
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
        },
        voted: {
            type: Schema.Types.ObjectId,
            ref: 'Nominees',
        }
    }],

    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Users', UserSchema);