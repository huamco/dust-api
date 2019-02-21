const net = require('net');
const io = require('socket.io-client');
var Struct = require('struct');

const server = net.createServer();
server.listen(8124, '127.0.0.1', function () {
    console.log("Device Server Bound");
});

server.on('connection', function (device) {
    console.log('Device Connection!');
    connectionUserInfof(device);

    //  Socket.io Client
    var chatting_socket = io("http://localhost:2000");

    device.on('data', function(data){
        if(chatting_socket.id != null) {
            var object = {};

            console.log("DATA Buffer Size: ", data.length);
            console.log('m_byStart', data.readUInt8(0).toString(16));
            console.log('m_byCmd', data.readUInt8(1).toString(16));
            console.log('m_byAddr', data.readUInt8(2).toString(16));
            console.log('m_byLen', data.readUInt8(3).toString(16));

            for(var i=0; i<10; i++) {
                console.log('m_byaAlarm_history['+ i +']', data.readUInt8(4+i).toString(16));
            }
            console.log('m_wS_mode ', data.readUInt16BE(14).toString(16));
            console.log('m_wM_status', data.readUInt16BE(16).toString(16));

            for(var i=0; i<4; i++) {
                console.log('m_waCurrent_nowx10['+ i +']:', data.readUInt16BE(18+(i*2)).toString(16));
                console.log("Index:", 18+(i*2));
            }
            console.log('m_wPressure:', data.readUInt16BE(26).toString(16));
            console.log('m_wParam_runtime:', data.readUInt16BE(28).toString(16));

            PRARAM(data);
            SPARAM(data);

            // 99, 49
            console.log('m_fParam_power:', data.readFloatBE(100));
            //104
            console.log('m_wReserved [0]', data.readUInt16BE(105).toString(16));
            console.log('m_wReserved [1]', data.readUInt16BE(107).toString(16));
            for(var i=0; i<5; i++ ) {
                console.log('m_byReserved [' + i + ']', data.readUInt8(109+i).toString(16));
                console.log('index: ', 109+i);
            }
            console.log('m_byChk1:', data.readUInt8(113).toString(16));
            console.log('m_byChk2:', data.readUInt8(114).toString(16));
            console.log('m_byEnd:', data.readUInt8(115).toString(16));


           // console.log('m_f:', data.readUInt16BE(26).toString(16));

            //console.log('m_wS_mode ', data.readUInt16BE(13).toString(16));

            chatting_socket.emit("Device-Data", {id:chatting_socket.id, data: data.toString('hex')});
        }
       console.log(data);
    });

    chatting_socket.on("ID_REGISTRATION", function () {
       console.log("Device ID:", chatting_socket.id);
    });

});

//  Private Method
function connectionUserInfof(device) {
    console.log("[Client Information]");
    console.log(device.remoteAddress);
    console.log(device.remotePort);
}

function PRARAM(data) {
    var RPARAM_stRunParam = Buffer.allocUnsafe(20);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(30), 0);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(31), 1);
    RPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(32), 2);
    RPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(34), 4);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(36), 6);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(37), 7);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(38), 8);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(39), 9);
    RPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(40), 10);
    RPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(42), 12);
    RPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(44), 14);
    RPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(46), 16);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(48), 18);
    RPARAM_stRunParam.writeUInt8(data.readUInt8(49), 19);
    //console.log(RPARAM_stRunParam.toString('hex'));
}


function SPARAM (data) {
    var SPARAM_stRunParam = Buffer.allocUnsafe(50);
    for(var i=0; i<6; i++) {
        SPARAM_stRunParam.writeUInt8(data.readUInt8(50+i), i);
        //console.log('index:', 50+i);
    }
    for(var i=0; i<5; i++) {
        SPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(56+(2*i)), 6+(2*i));
    }
    for(var i=0; i<5; i++) {
        SPARAM_stRunParam.writeInt16BE(data.readInt16BE(66+(2*i)), 16+(2*i));
        //console.log('index:', 66+(2*i));
        //console.log('Position', 16+(2*i));
    }
    //74 ,24
    for(var i=0; i<10; i++) {
        SPARAM_stRunParam.writeUInt8(data.readUInt8(76+i), 26+i);
       // console.log('index:', 76+i);
       // console.log('Position:', 26+i);
    }
    //  85, 35
    for(var i=0; i<5; i++) {
        SPARAM_stRunParam.writeUInt16BE(data.readUInt16BE(86+(2*i)), 36+(2*i));
       // console.log('index:', 86+(2*i));
        //console.log('Position:', 36+(2*i));
    }
//  94, 44
    for(var i=0; i<4; i++) {
        SPARAM_stRunParam.writeUInt8(data.readUInt8(96+i), 46+i);
        //console.log('index:', 96+i);
        //console.log('Position:', 46+i);
    }

    //console.log(SPARAM_stRunParam.toString('hex'));

}
