const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var json2xls = require('json2xls');
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

    app.use(json2xls.middleware);
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
/*
company
{
    "_id" : ObjectId("5c876251a90d2d29b8145cb7"),
    "id" : 1,
    "name" : "testCompany11",
    "address1" : "testCompany11",
    "address2" : "testCompany",
    "zipcode1" : null,
    "tel" : null,
    "fax" : null,
    "isActive" : 1,
    "monitoringType" : 1,
    "createDate" : ISODate("2019-03-12T07:40:01.031Z"),
    "updateDate" : ISODate("2019-03-12T07:40:01.031Z"),
    "__v" : 0
}
* */

