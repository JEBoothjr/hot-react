'use strict';

module.exports.ipaddress = function(req, res, next) {
    res.locals.app = res.locals.app || {};
    res.locals.app.user_ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    next();
};
