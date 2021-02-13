'use strict';
module.exports = function (app) {
    const awards = require('../controllers/awardController');

    // user Routes
    app.route('/awardsEvents')
        .get(awards.listAllAwards)
        .post(awards.createAwardEvent);

    app.route('/awardsEvents/:awardId')
        .get(awards.getAward)
};