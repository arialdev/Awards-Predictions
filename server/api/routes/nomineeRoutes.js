'use strict';
module.exports = function (app) {
    const nominee = require('../controllers/nomineeController');
    app.route('/awardsPredictions/nominee/:nomineeId')
        .get(nominee.getNomineePicture);
};