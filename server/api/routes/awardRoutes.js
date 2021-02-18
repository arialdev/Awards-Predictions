'use strict';
module.exports = function (app) {
    const awards = require('../controllers/awardController');

    // user Routes
    app.route('/awardsPredictions/awardsEvents')
        .get(awards.listAllAwards)
        .post(awards.createAwardEvent);

    app.route('/awardsPredictions/awardsEvents/:awardId')
        .get(awards.findAwardById);

    app.route('/awardsPredictions/awardsEvents/:awardEventName/:awardEdition')
        .get(awards.findAwardEventByNameAndEdition)
};