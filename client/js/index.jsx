'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Main = require('./main.jsx');
var Home = require('./pages/home.jsx');

var routes = (
    <Route handler={Main}>
        <Route path="/" handler={Home}/>
    </Route>
);

Router.run(routes, Router.HistoryLocation, function(Root){
    React.render(<Root />, document.getElementById('main'));
});
