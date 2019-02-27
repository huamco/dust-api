const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function (db) {
    const app = express();

    // Middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(function (req, res, next) { //1
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Request-Method', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Scope');

        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    app.use(fileUpload());
    app.use(logger('dev'));
    app.use(cookieParser());

    // mongoose connection pool
    const mongoStore = new MongoStore({
        mongooseConnection: db
    });
    app.use(session({
        saveUninitialized: true,
        resave: false,
        secret: 'apiDBConnectSession',
        store: mongoStore
    }));

    // REST API
    require('./api')(app);

    // SOCKET IO
    require('./socket')(app);

    return app;
};
