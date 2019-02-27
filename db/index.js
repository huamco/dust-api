const mongoose = require('mongoose');
module.exports = function () {
    // Schema Model Import
    require('./models');

    // mongoose connect
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/hac', {
        promiseLibrary: global.Promise,
        useNewUrlParser: true,
        useCreateIndex: true
    });
    const db = mongoose.connection;
    db.once('open', function () {
        console.log('DB connected!');
    });
    db.on('error', function (err) {
        console.log('DB ERROR:', err);
    });

    return db;
};
