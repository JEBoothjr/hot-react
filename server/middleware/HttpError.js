'use strict';

var logger = require('../lib/Logger'),
    ServerError = require('../lib/Error').ServerError;

module.exports.notFoundError = function(req, res, next) {
    var responseError = new ServerError(404, ServerError.REASONS.NOT_FOUND, "Not found");

    if (req.accepts('html')) {
        res.status(responseError.status).render('pages/404', {
            title: "Not Found",
            layout: "page"
        });
    } else if (req.accepts(['json', 'application/json'])) {
        res.status(responseError.status).json(responseError.toJSON());
    } else if (req.accepts('text')) {
        res.status(responseError.status).send(responseError.message);
    } else {
        next();
    }
};

module.exports.internalServerError = function(err, req, res, next) {
    var responseError,
        errorPage = 'pages/500';

    if (err.code && err.code === "EBADCSRFTOKEN") {
        responseError = new ServerError(403, ServerError.REASONS.UNAUTHORIZED_ACCESS, "Unauthorized access", err.toString());
        errorPage = 'pages/403';
    } else if (!err.toJSON) {
        responseError = new ServerError(500, ServerError.REASONS.INTERNAL_SERVER_ERROR, "Internal server error", err.toString());
    } else {
        responseError = err;
    }

    if (responseError.status === 500 || err.code === "EBADCSRFTOKEN") {
        logger.error(JSON.stringify({
            responseError: responseError,
            systemError: responseError.systemError
        }, null, 2));

        if (req.accepts('html')) {
            res.status(responseError.status).render(errorPage, {
                title: "Internal Server Error",
                layout: "page"
            });
        } else if (req.accepts(['json', 'application/json'])) {
            res.status(responseError.status).json(responseError.toJSON());
        } else if (req.accepts('text')) {
            res.status(responseError.status).send(responseError.message);
        } else {
            res.status(responseError.status).send(responseError.message);
        }
    } else {
        res.status(responseError.status).json(responseError.toJSON());
    }
};