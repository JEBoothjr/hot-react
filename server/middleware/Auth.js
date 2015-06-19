'use strict';

var logger = require('../lib/Logger'),
    config = require('config');

module.exports.token = function(req, res, next) {
    var cookieName = config.get('server.session.cookie.name'),
        token = req[cookieName] ? req[cookieName].token : null;

    if (token) {
        logger.debug("Got Token");

        next();
    } else {
        logger.debug("No Token");
        //No token, so let other middleware handle it accordingly
        next();
    }
};

module.exports.isAuthorizedUser = function(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/login');
};