'use strict';
module.exports = function (app) {
    const votes = require('../controllers/voteController');
    app.route('/awardsPredictions/votes/:awardId')
        .post(votes.createVotes);
}