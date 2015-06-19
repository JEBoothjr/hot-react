'use strict';

var config = require('config'),
    express = require('express'),
    router = express.Router(),
    authMiddleware = require('../middleware/Auth');

var isHot = function(){
    return process.env.NODE_ENV === undefined || process.env.NODE_ENV.indexOf('development') !== -1;
};

router.get('/', function(req, res) {
    res.render('pages/react', {
        title: "Welcome!",
        layout: "page",
        user: req.user,
        csrfToken: req.csrfToken(),
        hot: isHot()
    });
});

router.get('/login', function(req, res) {
    res.render('pages/react', {
        title: "Login",
        layout: "page",
        csrfToken: req.csrfToken(),
        hot: isHot()
    });
});

router.get('/logout', function(req, res) {
    req[config.get('server.session.cookie.name')].destroy();

    res.redirect('/login');
});

router.get('/signup', function(req, res) {
    res.render('pages/signup', {
        title: "Signup",
        layout: "page",
        csrfToken: req.csrfToken(),
        hot: isHot()
    });
});

router.get('/secure', authMiddleware.isAuthorizedUser, function(req, res) {
    res.render('pages/secure', {
        title: "Welcome to Secure!",
        layout: "page",
        user: req.user,
        csrfToken: req.csrfToken(),
        hot: isHot()
    });
});

exports.router = router;