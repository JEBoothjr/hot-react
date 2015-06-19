'use strict';

module.exports.ipaddress = function(req, res, next) {
    res.locals.peaposy = res.locals.peaposy || {};
    res.locals.peaposy.user_ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    next();
};