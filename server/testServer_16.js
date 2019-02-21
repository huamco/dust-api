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
        console.log('Data Event');
        console.log('Data Event' , data.toString('hex'));

        if(chatting_socket.id != null) {
            var object = {};
            object['m_byStart'] = data.readUInt8(0).toString(16);
            object['m_byCmd'] = data.readUInt8(1).toString(16);
            object['m_byAddr'] = data.readUInt8(2).toString(16);
            object['m_byLen'] =  data.readUInt8(3).toString(16);
            var array_process = [];
            for(var i=0; i<10; i++) {
                array_process.push(data.readUInt8(4+i).toString(16));
            }
            object['m_byaAlarm_history'] = array_process;
            object['m_wS_mode'] = data.readUInt16BE(14).toString(16);
            object['m_wM_status'] = data.readUInt16BE(16).toString(16);
            array_process = [];
            for(var i=0; i<4; i++) {
                array_process.push(data.readUInt16BE(18+(i*2)).toString(16));
                //console.log('m_waCurrent_nowx10['+ i +']:', data.readUInt16BE(18+(i*2)).toString(16));
                //console.log("Index:", 18+(i*2));
            }
            object['m_waCurrent_nowx10'] = array_process;
            array_process = [];

            object['m_wPressure'] = data.readUInt16BE(26).toString(16);
            object['m_wParam_runtime'] = data.readUInt16BE(28).toString(16);

            object['m_stRunParam'] = PRARAM(data);
            object['m_stSysParam'] = SPARAM(data);

            // 99, 49
            object['m_fParam_power'] = data.readFloatBE(100);
            array_process.push(data.readUInt16BE(105).toString(16));
            array_process.push(data.readUInt16BE(107).toString(16));
            object['m_wReserved']= array_process;
            array_process = [];

            for(var i=0; i<5; i++ ) {
                array_process.push(data.readUInt8(109+i).toString(16));
            }
            object['m_byReserved'] = array_process;
            array_process = [];

            object['m_byChk1'] = data.readUInt8(113).toString(16);
            object['m_byChk2'] = data.readUInt8(114).toString(16);
            object['m_byEnd'] = data.readUInt8(115).toString(16);

            var DeviceDataToJSON = JSON.stringify(object, null, 4);
            console.log(DeviceDataToJSON);

            //chatting_socket.emit("Device-Data", {id:chatting_socket.id, data: data.toString('hex')});
            chatting_socket.emit("Device-Data", {id:chatting_socket.id, data: DeviceDataToJSON});
        }
       //console.log(data);
    });

    chatting_socket.on("ID_REGISTRATION", function () {
       console.log("Device ID:", chatting_socket.id);
    });


    chatting_socket.on("DeviceSetting2", function(data){
        console.log("[Device Setting!!!]");
        console.log(data);
        device.write("SDKSADSADSADSA");
    });
});

//  Private Method
function connectionUserInfof(device) {
    console.log("[Client Information]");
    console.log(device.remoteAddress);
    console.log(device.remotePort);
}

function PRARAM(data) {
    var object = {};
    object['m_byMode'] = data.readUInt8(30);
    object['m_byOver_current'] = data.readUInt8(31);
    object['m_wAuto_puls_val'] = data.readUInt16BE(32);
    object['m_wAlarm_pressure'] = data.readUInt16BE(34);

    object['m_byAlarm_current_diff'] = data.readUInt8(36);
    object['m_byPuls_diff'] = data.readUInt8(37);
    object['m_byPuls_sel'] = data.readUInt8(38);
    object['m_byValve_sel'] = data.readUInt8(39);

    object['m_wPuls_open_time'] = data.readUInt16BE(40);
    object['m_wPuls_delay_time'] = data.readUInt16BE(42);
    object['m_wShake_on_pressure'] = data.readUInt16BE(44);
    object['m_wShake_on_time'] = data.readUInt16BE(46);

    object['m_byShake_delay_time'] = data.readUInt8(48);
    object['m_byShake_diff'] = data.readUInt8(49);
    return object;
}


function SPARAM (data) {
    var obj = {};
    obj['m_byType'] =  data.readUInt8(50);
    obj['m_byMemory_on'] =  data.readUInt8(51);
    obj['m_byMulti_in'] =  data.readUInt8(52);
    obj['m_byBlackout'] =  data.readUInt8(53);
    obj['m_byUint_kpa'] =  data.readUInt8(54);
    obj['m_byMotor_num'] =  data.readUInt8(55);

    obj['m_wCali_ct1'] =  data.readUInt16BE(56);
    obj['m_wCali_ct2'] =  data.readUInt16BE(58);
    obj['m_wCali_ct3'] =  data.readUInt16BE(60);
    obj['m_wCali_ct4'] =  data.readUInt16BE(62);
    obj['m_wCali_pressure'] =  data.readUInt16BE(64);

    obj['m_nRev_ct1'] =  data.readUInt16BE(66);
    obj['m_nRev_ct2'] =  data.readUInt16BE(68);
    obj['m_nRev_ct3'] =  data.readUInt16BE(70);
    obj['m_nRev_ct4'] =  data.readUInt16BE(72);
    obj['m_nRev_pressure'] =  data.readUInt16BE(74);

    obj['m_byComm_addr'] = data.readUInt8(76);
    obj['m_byLanguage'] = data.readUInt8(77);
    obj['m_byComm_baud'] = data.readUInt8(78);
    obj['m_byDelay_eocr'] = data.readUInt8(79);
    obj['m_byPower_phase'] = data.readUInt8(80);
    obj['m_byAll_reset'] = data.readUInt8(81);
    obj['m_byRuntime_reset'] = data.readUInt8(82);
    obj['m_byPower_acc_reset'] = data.readUInt8(83);
    obj['m_byInverter_out'] = data.readUInt8(84);
    obj['m_byAlarm_history_reset'] = data.readUInt8(85);

    obj['m_wPower_value'] = data.readUInt16BE(86);
    obj['m_wPassword'] = data.readUInt16BE(88);
    obj['m_wTime_change_fileter'] = data.readUInt16BE(90);
    obj['m_wAnalog_out'] = data.readUInt16BE(92);
    obj['m_wAnalog_auto_out'] = data.readUInt16BE(94);

    obj['m_byManual_puls_cycle'] = data.readUInt8(96);
    obj['m_byManual_hauto_puls'] = data.readUInt8(97);
    obj['m_byAlarm_relay'] = data.readUInt8(98);
    obj['m_byFan_on_time'] = data.readUInt8(99);
    return obj;
}
