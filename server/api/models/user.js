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
        type: Schema.Types.ObjectId,
        ref: 'Votes',
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

module.exports = mongoose.model('Users', UserSchema);