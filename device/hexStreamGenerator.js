const crc = require("crc");

function stringToHex(value) {
    return parseInt(value);
}

module.exports.jsonToHex = function jsonToBuffer(jsonData) {
    var parsedData = JSON.parse(jsonData);
    var buffer = Buffer.alloc(136);
    var position=0;
    buffer.writeUInt8(stringToHex(parsedData['m_byStart']), position++);
    buffer.writeUInt8(stringToHex(parsedData['m_byCmd']), position++);
    buffer.writeUInt8(stringToHex(parsedData['m_byAddr']), position++);
    buffer.writeUInt8(stringToHex(parsedData['m_byLen']), position++);

    for(var j=0; j<parsedData['m_byaAlarm_history'].length; j++) {
        buffer.writeUInt8(stringToHex(parsedData['m_byaAlarm_history'][j]), position++);
    }
    buffer.writeUInt16LE(stringToHex(parsedData['m_wS_mode']), 14);
    buffer.writeUInt16LE(stringToHex(parsedData['m_wM_status']), 16);
    for(var i=0; i<parsedData['m_waCurrent_nowx10'].length; i++) {
        buffer.writeUInt16LE(stringToHex(parsedData['m_waCurrent_nowx10'][i]), 18+(i*2));
    }
    buffer.writeUInt16LE(stringToHex(parsedData['m_wPressure']), 26);
    buffer.writeUInt16LE(stringToHex(parsedData['m_wParam_runtime']), 28);
    //  Setting PRARAM
    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byMode']), 30);
    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byOver_current']), 31);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stRunParam']['m_wAuto_puls_val']), 32);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stRunParam']['m_wAlarm_pressure']), 34);

    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byAlarm_current_diff']), 36);
    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byPuls_diff']), 37);
    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byPuls_sel']), 38);
    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byValve_sel']), 39);

    buffer.writeUInt16LE(stringToHex(parsedData['m_stRunParam']['m_wPuls_open_time']), 40);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stRunParam']['m_wPuls_delay_time']), 42);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stRunParam']['m_wShake_on_pressure']), 44);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stRunParam']['m_wShake_on_time']), 46);

    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byShake_delay_time']), 48);
    buffer.writeUInt8(stringToHex(parsedData['m_stRunParam']['m_byShake_diff']), 49);

    // Setting SPARAM
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byType']), 50);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byMemory_on']), 51);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byMulti_in']), 52);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byBlackout']), 53);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byUint_kpa']), 54);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byMotor_num']), 55);

    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wCali_ct1']), 56);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wCali_ct2']), 58);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wCali_ct3']), 60);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wCali_ct4']), 62);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wCali_pressure']), 64);


    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_nRev_ct1']), 66);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_nRev_ct2']), 68);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_nRev_ct3']), 70);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_nRev_ct4']), 72);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_nRev_pressure']), 74);


    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byComm_addr']), 76);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byLanguage']), 77);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byComm_baud']), 78);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byDelay_eocr']), 79);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byPower_phase']), 80);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byAll_reset']), 81);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byRuntime_reset']), 82);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byPower_acc_reset']), 83);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byInverter_out']), 84);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byAlarm_history_reset']), 85);


    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wPower_value']), 86);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wPassword']), 88);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wTime_change_fileter']), 90);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wAnalog_out']), 92);
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wAnalog_auto_out']), 94);

    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byManual_puls_cycle']), 96);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byManual_hauto_puls']), 97);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byAlarm_relay']), 98);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byFan_on_time']), 99);

    // add
    buffer.writeUInt16LE(stringToHex(parsedData['m_stSysParam']['m_wEth_id']), 100);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byEth_use']), 102);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byEth_addr1']), 103);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byEth_addr2']), 104);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byEth_addr3']), 105);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byEth_addr4']), 106);
    buffer.writeUInt8(stringToHex(parsedData['m_stSysParam']['m_byReserved1']), 107);

    buffer.writeFloatLE(parseFloat(parsedData['m_fParam_power']), 108);   //100
    buffer.writeUInt16LE(stringToHex(parsedData['m_wReserved'][0]), 112); //105
    buffer.writeUInt16LE(stringToHex(parsedData['m_wReserved'][1]), 114); //107

    //add
    buffer.writeInt16LE(stringToHex(parsedData['m_wTSensor_data']), 116);
    buffer.writeInt16LE(stringToHex(parsedData['m_wP1Sensor_data']), 118);
    buffer.writeInt16LE(stringToHex(parsedData['m_wP2Sensor_data']), 120);
    buffer.writeInt16LE(stringToHex(parsedData['m_wP3Sensor_data']), 122);
    buffer.writeInt16LE(stringToHex(parsedData['m_wP4Sensor_data']), 124);
    buffer.writeUInt8(stringToHex(parsedData['m_byTSensor_status']), 126);
    buffer.writeUInt8(stringToHex(parsedData['m_byPSensor_status']), 127);

    for(var i=0; i<5; i++ ) {
        buffer.writeUInt8(stringToHex(parsedData['m_byReserved'][i]), 128+i); //109
    }

    buffer.writeUInt8(stringToHex(parsedData['m_byChk1']), 133); //113
    buffer.writeUInt8(stringToHex(parsedData['m_byChk2']), 134); //114
    buffer.writeUInt8(stringToHex(parsedData['m_byEnd']), 135);  //115

    //console.log(buffer.toString('hex'));
    var recvBuffer = new Buffer(buffer.length);
    recvBuffer = Buffer(buffer);
    var dataSize    = recvBuffer.length;
    //console.log('dataSize',dataSize);
    //console.log('recvBuffer',recvBuffer.toString('hex'));
    var crcBuff = new Buffer(2);
    var crcBuff1 = new Buffer(2);
    crcBuff.writeUInt16BE(crc.crc16modbus(recvBuffer.slice(0, dataSize - 3)), 0);
    //crcBuff1.writeUInt16LE(crc.crc16modbus(recvBuffer.slice(0, dataSize - 3)), 0);
    //console.log('crcBuff[0]:::',crcBuff[0]);
    //console.log('crcBuff[1]:::',crcBuff[1]);
    /*console.log('crcBuff[0]:::',crcBuff1[0]);
    console.log('crcBuff[1]:::',crcBuff1[1]);
    console.log('crcBuff[0]:::',crcBuff[0].toString(10));
    console.log('crcBuff[1]:::',crcBuff[1].toString(10));
    console.log('crcBuff[0]:::',crcBuff1[0].toString(10));
    console.log('crcBuff[1]:::',crcBuff1[1].toString(10));
    console.log('recvBuffer[dataSize - 3]:::',recvBuffer[dataSize - 3]);
    console.log('recvBuffer[dataSize - 2]:::',recvBuffer[dataSize - 2]);*/

    console.log('hex checksum ok');
    buffer.writeUInt8(stringToHex(crcBuff[1].toString(10)), 133); //113
    buffer.writeUInt8(stringToHex(crcBuff[0].toString(10)), 134); //114
    return buffer;
}
