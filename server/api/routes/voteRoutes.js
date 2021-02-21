'use strict';
module.exports = function (app) {
    const votes = require('../controllers/voteController');
    app.route('/awardsPredictions/votes/:awardId')
        .post(votes.createVotes);

    app.route('/awardsPredictions/votes/image/:userId')
        .post(votes.renderImage)
}