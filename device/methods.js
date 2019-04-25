//  Private Method
function connectionUserInfof(device) {
    // console.log("[Client Information]");
    // console.log(device.remoteAddress);
    // console.log(device);
    // console.log(device.remotePort);
}

function PRARAM(data) {
    // console.log("[PRARAM]", data);
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

    // add
    obj['m_wEth_id'] = data.readUInt16LE(100).toString(10);
    obj['m_byEth_use'] = data.readUInt8(102).toString(10);
    obj['m_byEth_addr1'] = data.readUInt8(103).toString(10);
    obj['m_byEth_addr2'] = data.readUInt8(104).toString(10);
    obj['m_byEth_addr3'] = data.readUInt8(105).toString(10);
    obj['m_byEth_addr4'] = data.readUInt8(106).toString(10);
    obj['m_byReserved1'] = data.readUInt8(107).toString(10);

    return obj;
}

module.exports = { connectionUserInfof, PRARAM, SPARAM };
