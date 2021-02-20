'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: 'Who emit this vote?',
    },
    awardEvent: {
        type: Schema.Types.ObjectId,
        ref: 'AwardEvents',
        required: 'To which awards event belongs this vote?',
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: 'Which is this vote\'s category?',
    },
    voted: {
        type: Schema.Types.ObjectId,
        ref: 'Nominees',
        required: 'To whom is this vote for?',
    },
});

module.exports = mongoose.model('Votes', VoteSchema);