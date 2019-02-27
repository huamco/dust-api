const net = require('net');
const io = require('socket.io-client');
const Struct = require('struct');
const hexStream = require('./hexStreamGenerator');
const crc = require("crc");
const mongoose = require('mongoose');
const PacketParams = mongoose.model('PacketParams');
const { connectionUserInfof, PRARAM, SPARAM } = require('./methods');

const server = net.createServer();
/*server.listen(8124, '192.168.0.3', function () {
    console.log("Device Server Bound");
});*/

server.listen(8124, '127.0.0.1', function () {
    console.log("Device Server Bound");
});

server.on('connection', function (device) {
    console.log('Device Connection!');
    connectionUserInfof(device);

    //  Error Detection
    process.on('uncaughtException', (err) => {
        console.log("Unexpected Connection Error");
        chatting_socket.emit("Device-Data", {id:chatting_socket.id, data: null, error: true, buff:null});
        chatting_socket.emit('byebye', chatting_socket.id);
        chatting_socket.id = null;
    });

    //  Socket.io Client
    var chatting_socket = io("http://localhost:2000");

    device.on('close', () => {
        console.log("Device Close!!", chatting_socket.id);
        chatting_socket.emit("Device-Data", {id:chatting_socket.id, data: null, error: true, buff:null});
        chatting_socket.emit('byebye', chatting_socket.id);
        chatting_socket.id = null;
    });

    device.on('data', function(data){
        //console.log('TestServer Data Event');
        var recvBuffer = new Buffer(0);
        recvBuffer = Buffer.concat([recvBuffer, data], recvBuffer.length + data.length);
        var dataSize    = recvBuffer.length;
        /* console.log('dataSize',dataSize);
         console.log('recvBuffer',recvBuffer.toString('hex'));
         console.log('chatting_socket.id',chatting_socket.id);*/
        if(chatting_socket.id != null) {
            var object = {};
            object['m_byStart'] = data.readUInt8(0).toString(10);
            object['m_byCmd'] = data.readUInt8(1).toString(10);
            object['m_byAddr'] = data.readUInt8(2).toString(10);
            object['m_byLen'] =  data.readUInt8(3).toString(10);
            var array_process = [];
            for(var i=0; i<10; i++) {
                array_process.push(data.readUInt8(4+i).toString(10));
            }
            object['m_byaAlarm_history'] = array_process;
            object['m_wS_mode'] = data.readUInt16LE(14).toString(10);
            object['m_wM_status'] = data.readUInt16LE(16).toString(10);
            array_process = [];
            for(var i=0; i<4; i++) {
                array_process.push(data.readUInt16LE(18+(i*2)).toString(10));
                //console.log('m_waCurrent_nowx10['+ i +']:', data.readUInt16LE(18+(i*2)).toString(16));
                //console.log("Index:", 18+(i*2));
            }
            object['m_waCurrent_nowx10'] = array_process;
            array_process = [];

            object['m_wPressure'] = data.readUInt16LE(26).toString(10);
            object['m_wParam_runtime'] = data.readUInt16LE(28).toString(10);

            object['m_stRunParam'] = PRARAM(data);
            object['m_stSysParam'] = SPARAM(data);

            // 99, 49
            object['m_fParam_power'] = data.readFloatLE(100);
            array_process.push(data.readUInt16LE(105).toString(10));
            array_process.push(data.readUInt16LE(107).toString(10));
            object['m_wReserved']= array_process;
            array_process = [];

            for(var i=0; i<5; i++ ) {
                array_process.push(data.readUInt8(109+i).toString(10));
            }
            object['m_byReserved'] = array_process;
            array_process = [];

            object['m_byChk1'] = data.readUInt8(113).toString(10);
            object['m_byChk2'] = data.readUInt8(114).toString(10);
            object['m_byEnd'] = data.readUInt8(115).toString(10);

            /*console.log(recvBuffer.slice(1, dataSize - 3))
            console.log('data.readUInt8(113)==>', data.readUInt8(113));
            console.log('data.readUInt8(114)==>', data.readUInt8(114));*/
            var crcBuff = new Buffer(2);
            crcBuff.writeUInt16BE(crc.crc16modbus(recvBuffer.slice(0, dataSize - 3)), 0);
            /*console.log('crcBuff[0]:::',crcBuff[0]);
            console.log('crcBuff[1]:::',crcBuff[1]);
            console.log('recvBuffer[dataSize - 2]:::',recvBuffer[dataSize - 3]);
            console.log('recvBuffer[dataSize - 1]:::',recvBuffer[dataSize - 2]);*/
            if(crcBuff[0] == recvBuffer[dataSize - 2] && crcBuff[1] == recvBuffer[dataSize - 3]) {
                //console.log('checksum ok');
                var DeviceDataToJSON = JSON.stringify(object, null, 4);
                chatting_socket.emit("Device-Data", {id:chatting_socket.id, data: DeviceDataToJSON, error: false, buff: recvBuffer.toString('hex')});
            }
        }
    });

    chatting_socket.on("ID_REGISTRATION", function () {
        //console.log("Device ID REGISTRATION:", chatting_socket.id);
    });

    chatting_socket.on("DeviceSetting2", function(data){
        console.log("[Device Setting!!! DeviceSetting2]");
        //console.log('Setting Info:', data);
        //console.log('Setting stringify Info:', JSON.parse(data.bufferData));
        //console.log('Setting parse nfo:', JSON.parse(data.bufferData));
        //console.log(typeof(data.bufferData));
        var saveLogData = new PacketParams(JSON.parse(data.bufferData));
        //var hexBuffer = hexStream.jsonToHex(data.bufferData);
        /*console.log(saveLogData);
        console.log(typeof(saveLogData));*/
        saveLogData.save(function(saveErr){
            if(saveErr) throw saveErr;
        });

        var hexBuffer = hexStream.jsonToHex(data.bufferData);
        console.log('hexBuffer',hexBuffer.toString('hex'));
        if(hexBuffer != null) {
            console.log('save checksum ok');
            device.write(hexBuffer);
        }
        /*console.log(hexBuffer.toString('hex'));
        var recvBuffer = new Buffer(hexBuffer.length);
        recvBuffer = Buffer(hexBuffer);
        var dataSize    = recvBuffer.length;
        console.log('dataSize',dataSize);
        console.log('recvBuffer',recvBuffer.toString('hex'));
        var crcBuff = new Buffer(2);
        crcBuff.writeUInt16BE(crc.crc16modbus(recvBuffer.slice(0, dataSize - 3)), 0);
        console.log('crcBuff[0]:::',crcBuff[0]);
        console.log('crcBuff[1]:::',crcBuff[1]);
        console.log('recvBuffer[dataSize - 2]:::',recvBuffer[dataSize - 3]);
        console.log('recvBuffer[dataSize - 1]:::',recvBuffer[dataSize - 2]);
        if(crcBuff[0] == recvBuffer[dataSize - 2] && crcBuff[1] == recvBuffer[dataSize - 3]) {

        }
*/
    });
});



