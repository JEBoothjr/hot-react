'use strict';

var config = require('config'),
    path = require('path'),
    async = require('async'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    viewHelpers = require('./views/lib/helpers'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    domain = require('domain'),
    topDomain = domain.create(),
    sessions = require('client-sessions'),
    csurf = require('csurf'),
    errorMiddleware = require('./middleware/HttpError'),
    ipaddressMiddleware = require('./middleware/RequestInfo').ipaddress,
    tokenMiddleware = require('./middleware/Auth.js').token,
    siteRouter = require('./routers/siteRouter').router,
    logger = require('./lib/Logger');

/* istanbul ignore next */
if (!logger.configured) {
    logger.configure(config.logging.winston);
}

/* istanbul ignore next */
topDomain.on('error', function(error) {
    var message = (error.message || error) + ((error && error.stack) ? "\n" + error.stack : '');

    logger.error(message);
});

var initApp = function(callback) {
    logger.info("Initializing Application");

    app.set('views', './server/views/');
    app.engine('handlebars', exphbs({
        defaultLayout: 'app',
        helpers: viewHelpers,
        layoutsDir: path.join(app.settings.views, "layouts"),
        partialsDir: [
            path.join(app.settings.views, "partials")
        ]
    }));
    app.set('view engine', 'handlebars');

    app.use(express.static(__dirname + '/public'));

    callback(null, true);
};

var initRoutingAndMiddleware = function(callback) {
    logger.info("Initializing Routing and Middleware");

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    //app.set('trust proxy', 1); // trust first proxy
    app.use(sessions({
        cookieName: config.get('server.session.cookie.name'), // cookie name dictates the key name added to the request object
        secret: config.get('server.session.secret'), // should be a large unguessable string
        duration: config.get('server.session.cookie.expiration'), // how long the session will stay valid in ms
        activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        cookie: {
            path: '/', // cookie will only be sent to requests under '/api'
            ephemeral: false, // when true, cookie expires when the browser closes
            httpOnly: true, // when true, cookie is not accessible from javascript
            secure: config.get('server.session.cookie.secure') // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
        }
    }));
    app.use(csurf({
        cookie: {
            key: "pp_csrf",
            secure: config.get('server.session.cookie.secure')
        }
    }));

    app.use(tokenMiddleware); //Must be first for token middleware to be handled first

    app.use(ipaddressMiddleware);
    app.use(siteRouter);

    app.use(errorMiddleware.notFoundError);
    app.use(errorMiddleware.internalServerError); //Must be last

    callback(null, true);
};

var connectToDB = function(callback) {
    logger.info("Connecting to Database");

    callback(false, true);
};

var startServer = function(callback) {
    logger.info("Starting Server...");

    /* istanbul ignore next */
    var port = config.server.port || process.env.PORT;
    app.set('port', port);

    /* istanbul ignore next */
    var server = app.listen(app.get('port'), function() {
        logger.info('Server listening on port ' + server.address().port);
        return callback(null, true);
    });
};

topDomain.run(function() {

    async.series([
            function(callback) {
                initApp(callback);
            },
            function(callback) {
                initRoutingAndMiddleware(callback);
            },
            function(callback) {
                connectToDB(callback);
            },
            function(callback) {
                startServer(callback);
            }
        ],
        /* istanbul ignore next */
        function(err) {
            if (err) {
                logger.error("Server startup sequence failed :\r\n" + err.message + "\r\n" + err.stack);
                setTimeout(function() {
                    process.exit(1);
                }, 2000);
            } else {
                console.log('Server Started : ' + new Date());
            }
        });
});

// For supertest
module.exports = app;