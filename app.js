const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
//const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
//const callRouter = require('./api/call');

const mongoose   = require('mongoose');
const net = require('net');

const tcpServer = require('./server/server');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
var dataMap = new Map();

var testArray = [];

io.on('connection', function (socket) {
    //console.log("-----------------------------------");
    console.log("Socket ID: " + socket.id);

    io.emit("ID_REGISTRATION", "ID_REGISTATION_PROCESS");
    socket.on('disconnect', function(){
        console.log('app.js bye bye!!!', socket.id);
        console.log("socket disconnected!");
    });

    socket.on('byebye', function(exit_id) {
        console.log('socket byebye:::::::::::');
        dataMap.delete(exit_id);
    });

    socket.on('Device-Data', function (bufferData) {
        //console.log('app.js DEVICE ID', bufferData.id);
        //console.log('app.js DEVICE DATA', bufferData.buff);
        //console.log(bufferData.error);
        dataMap.set(bufferData.id, {"socket_id":bufferData.id, "bufferData": bufferData.data, "error": bufferData.error, "buff": bufferData.buff});
        for(var [key, value] of dataMap) {
            testArray.push({"id":key, "data": value});
        }
        const PacketParams     = require('./models/packetParams');
        var saveLogData = new PacketParams(JSON.parse(bufferData.data));
        //console.log('bufferData.data=>', testArray);
        console.log(saveLogData);
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, function (err, client) {
            var db = client.db('hac');
            db.collection('PacketParams').insertOne(saveLogData, function (findErr, result) {
                if (findErr) throw findErr;
                //console.log(result);
                //mongoDriver.close();
            });
        });
        io.emit("Device_Monitoring_Data", JSON.stringify(testArray));
        testArray = [];
    });

    socket.on("DeviceSetting", function(data){
        //console.log("[Device Setting!!!]");
        //console.log(data.socket_id);
        io.to(data.socket_id).emit("DeviceSetting2", data);
    });

    socket.on('data', function (message) {
        //console.log('server data=>', message);
        io.emit('message', {type:'new-data', text: message});
    });
});

http.listen(2000, function(){
    //console.log("Socket.io Server Listen 2000");
    //new tcpServer('server','8124','127.0.0.1');
});

// Database
mongoose.Promise = global.Promise;
const promise = mongoose.connect('mongodb://localhost:27017/hac', {promiseLibrary: global.Promise });
const db = mongoose.connection;
db.once('open', function () {
    //console.log('DB connected!');
});
db.on('error', function (err) {
    //console.log('DB ERROR:', err);
});


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
//app.use(express.static("C:\\prj\\project_src\\web\\dist"));

app.set('port','3300');
app.listen(app.get('port'), function () {
    //console.log('server start 3300');
})

//app.use('/users', usersRouter);

// REST API
app.use('/company', require('./api/company'));
app.use('/users', require('./api/users'));
app.use('/dusts', require('./api/dusts'));
app.use('/dustLocation', require('./api/dustLocation'));
app.use('/dustConfig', require('./api/dustConfig'));
app.use('/login', require('./api/login'));
app.use('/uploadImage', require('./api/image'));
app.use('/packetData', require('./api/packetData'));

/*const server = net.createServer(function(socket) {
    console.log('createServer()');  // 연결이 되면 서버 로그에 남는 메시지
    socket.on('data', function(data){
        console.log('socket.on=>', data.toString('hex'));
        io.emit('message', {type:'new-data', text: data});
    });
    socket.on('end', function() {
        console.log('socket end');  // 연결이 끊어지면 서버 로그에 남는 메시지
    });
    socket.write('Hello World\r\n');  // 클라이언트에게 보여지는 메시지
});

var io = require('socket.io').listen(server);

server.listen(8124, function() {
    console.log('서버가 %d 포트에 연결되었습니다.', server.address().port);  // 서버가 실행되면 서버 로그에 남는 메시지
});*/



// const clnetIo = require('socket.io-client');
//
// var clientAA = null;
//
//
// var deviceServer = net.createServer((socket) => {
//     socket.on('data', function (data) {
//         clientAA = clnetIo("http://localhost:2000");
//        console.log(data);
//
//        clientAA.emit('Device-Data', data);
//     });
// });
//
// deviceServer.listen(8124, () => {
//     console.log('Device Server listen');
// });
//
//
// clientAA.on('connect', function () {
//     console.log("Enter Device");
// });
//
// clientAA.on('add_user', function(id){
//     if(this.users == null) {
//         this.users = id;
//         console.log("My id is " + this.users);
//     }
// });
//
// clientAA.on('join_room', function (socketID) {
//     this.device_socket_ID = socketID;
//     if(this.roomInfo == null) {
//         this.roomInfo = socketID;
//         console.log("Join room!", this.roomInfo);
//     }
//
// });
//
// clientAA.on('roomEvent', function(info) {
//     console.log(info);
// });
//
// clientAA.on('disconnect', function (reason) {
//     console.log("Disadas");
// });




//TCPIP
// const server = net.createServer(function(socket) {
//     console.log('createServer()');  // 연결이 되면 서버 로그에 남는 메시지
//     socket.on('data', function(data){
//         console.log('socket.on=>', data.toString('hex'));
//     });
//     socket.on('end', function() {
//         console.log('socket end');  // 연결이 끊어지면 서버 로그에 남는 메시지
//     });
//     socket.write('Hello World\r\n');  // 클라이언트에게 보여지는 메시지
// });
//
// server.listen(8124, function() {
//     console.log('서버가 %d 포트에 연결되었습니다.', server.address().port);  // 서버가 실행되면 서버 로그에 남는 메시지
// });


//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
//

//

//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//



// app.use('/client', require('./client/client'));
// app.use('/server', require('./server/server'));
//
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;
