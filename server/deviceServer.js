const net = require('net');
const io = require('socket.io-client');
var Struct = require('struct');
var hexStream = require('./hexStreamGenerator');
const PacketParams     = require('../models/packetParams');
var crc                 = require("crc");

const server = net.createServer();
server.listen(8124, '192.168.0.3', function () {
    console.log("Device Server Bound");
});

/*server.listen(8124, '127.0.0.1', function () {
    console.log("Device Server Bound");
});*/

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
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, function (err, client) {
            var db = client.db('hac');
            db.collection('PacketParams').insertOne(saveLogData, function (findErr, result) {
                if (findErr) throw findErr;
                //console.log(result);
                //mongoDriver.close();
            });

            /*db.collection('bufferData').insertOne(hexBuffer, function (findErr, result) {
                if (findErr) throw findErr;
                //console.log(result);
                //mongoDriver.close();
            });*/
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

//  Private Method
function connectionUserInfof(device) {
    //console.log("[Client Information]");
    //console.log(device.remoteAddress);
    //console.log(device.remotePort);
}

function PRARAM(data) {
    var object = {};
    object['m_byMode'] = data.readUInt8(30).toString(10);
    object['m_byOver_current'] = data.readUInt8(31).toString(10);
    object['m_wAuto_puls_val'] = data.readUInt16LE(32).toString(10);
    object['m_wAlarm_pressure'] = data.readUInt16LE(34).toString(10);

    object['m_byAlarm_current_diff'] = data.readUInt8(36).toString(10);
    object['m_byPuls_diff'] = data.readUInt8(37).toString(10);
    object['m_byPuls_sel'] = data.readUInt8(38).toString(10);
    object['m_byValve_sel'] = data.readUInt8(39).toString(10);

    object['m_wPuls_open_time'] = data.readUInt16LE(40).toString(10);
    object['m_wPuls_delay_time'] = data.readUInt16LE(42).toString(10);
    object['m_wShake_on_pressure'] = data.readUInt16LE(44).toString(10);
    object['m_wShake_on_time'] = data.readUInt16LE(46).toString(10);

    object['m_byShake_delay_time'] = data.readUInt8(48).toString(10);
    object['m_byShake_diff'] = data.readUInt8(49).toString(10);
    return object;
}


function SPARAM (data) {
    var obj = {};
    obj['m_byType'] =  data.readUInt8(50).toString(10);
    obj['m_byMemory_on'] =  data.readUInt8(51).toString(10);
    obj['m_byMulti_in'] =  data.readUInt8(52).toString(10);
    obj['m_byBlackout'] =  data.readUInt8(53).toString(10);
    obj['m_byUint_kpa'] =  data.readUInt8(54).toString(10);
    obj['m_byMotor_num'] =  data.readUInt8(55).toString(10);

    obj['m_wCali_ct1'] =  data.readUInt16LE(56).toString(10);
    obj['m_wCali_ct2'] =  data.readUInt16LE(58).toString(10);
    obj['m_wCali_ct3'] =  data.readUInt16LE(60).toString(10);
    obj['m_wCali_ct4'] =  data.readUInt16LE(62).toString(10);
    obj['m_wCali_pressure'] =  data.readUInt16LE(64).toString(10);

    obj['m_nRev_ct1'] =  data.readUInt16LE(66).toString(10);
    obj['m_nRev_ct2'] =  data.readUInt16LE(68).toString(10);
    obj['m_nRev_ct3'] =  data.readUInt16LE(70).toString(10);
    obj['m_nRev_ct4'] =  data.readUInt16LE(72).toString(10);
    obj['m_nRev_pressure'] =  data.readUInt16LE(74).toString(10);

    obj['m_byComm_addr'] = data.readUInt8(76).toString(10);
    obj['m_byLanguage'] = data.readUInt8(77).toString(10);
    obj['m_byComm_baud'] = data.readUInt8(78).toString(10);
    obj['m_byDelay_eocr'] = data.readUInt8(79).toString(10);
    obj['m_byPower_phase'] = data.readUInt8(80).toString(10);
    obj['m_byAll_reset'] = data.readUInt8(81).toString(10);
    obj['m_byRuntime_reset'] = data.readUInt8(82).toString(10);
    obj['m_byPower_acc_reset'] = data.readUInt8(83).toString(10);
    obj['m_byInverter_out'] = data.readUInt8(84).toString(10);
    obj['m_byAlarm_history_reset'] = data.readUInt8(85).toString(10);

    obj['m_wPower_value'] = data.readUInt16LE(86).toString(10);
    obj['m_wPassword'] = data.readUInt16LE(88).toString(10);
    obj['m_wTime_change_fileter'] = data.readUInt16LE(90).toString(10);
    obj['m_wAnalog_out'] = data.readUInt16LE(92).toString(10);
    obj['m_wAnalog_auto_out'] = data.readUInt16LE(94).toString(10);

    obj['m_byManual_puls_cycle'] = data.readUInt8(96).toString(10);
    obj['m_byManual_hauto_puls'] = data.readUInt8(97).toString(10);
    obj['m_byAlarm_relay'] = data.readUInt8(98).toString(10);
    obj['m_byFan_on_time'] = data.readUInt8(99).toString(10);
    return obj;
}
