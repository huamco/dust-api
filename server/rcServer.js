/*
 * rcServer(roomControlServer).js 시리얼통신을 이용해 객실 제어하는 서버, API 에서 사용되어야 하기 때문에
 * 싱글톤으로 구성
 * 2017-01-03
 */
var crc                 = require("crc");
var path                = require('path');
var appDir              = path.dirname(require.main.filename);

var CMD_TYPE            = require(appDir + "/core/rcServer/rcCommandType.js").CMD_TYPE;
var rcCommandFactory    = require(appDir + "/core/rcServer/rcCommandFactory.js");
var rcParserFactory     = require(appDir + "/core/rcServer/rcParserFactory.js");
var comm 			    = require(appDir + "/lib/serialPort.js");
var util			    = require(appDir + "/lib/util.js");
var debug			    = require(appDir + "/lib/debug.js");
var state 		        = require(appDir + "/lib/state.js");
var json 			    = require(appDir + "/lib/json.js");
var deviceMapS          = require(appDir + "/lib/deviceMapS.js");
var globalRegisterS     = require(appDir + "/lib/globalRegisterS.js");
var config              = json.load(appDir + "/config.json");
var lang 			    = config.SYS.LANGUAGE;
var STATE 		        = state.create(lang);

// 디바이스 스캔중이지 않아요
globalRegisterS.add("DEVICE_SCAN", "0");
globalRegisterS.add("DEVICE_STATE", "0");

// 디바이스 목록 검색
var _deviceScanReq = function() {
    globalRegisterS.set("DEVICE_SCAN", "1");
    // 1단계 전체단말 스캔 명령
    var buff = rcCommandFactory.create(CMD_TYPE.DEVICE_INFO_REQ, {lcu_no:0xff});
    comm.write(buff);
    require('deasync').sleep(config.RC_SERVER.CMD_DELAY);

    // 2단계 전체단말 정보획득 명령
    buff = rcCommandFactory.create(CMD_TYPE.DEVICE_INFO_REQ, {lcu_no:0x00});
    comm.write(buff);
    require('deasync').sleep(config.RC_SERVER.CMD_DELAY);

    // 3단계 각 중계기에 정보 획득 명령 전송
    // 설정된 LCU 범위만큼 검색한다.
    for(var i=config.RC_SERVER.LCU_BEGIN; i<=config.RC_SERVER.LCU_END; i++) {
        buff = rcCommandFactory.create(CMD_TYPE.DEVICE_INFO_REQ, {lcu_no:i});
        comm.write(buff);
        require('deasync').sleep(config.RC_SERVER.CMD_DELAY);
    }

    globalRegisterS.set("DEVICE_SCAN", "0");
    debug.info(STATE.SERIAL_COMMAND_SEND_SUCCESS.M + ": 0x" + CMD_TYPE.DEVICE_INFO_REQ.toString(16));
    return STATE.SERIAL_COMMAND_SEND_SUCCESS.C;
}

// 디바이스 상태 요청
var _deviceStateReq = function() {
    globalRegisterS.set("DEVICE_STATE", "1");

    // 스캔된 디바이스 정보 가져오기
    // 스캔 방식 전체 스캔
    var device = deviceMapS.all();
    for(var lcu in device) {
        var jsonObj = { lcu : device[lcu].no, rcu : 0 };
        _getRoomReq(jsonObj);
        require('deasync').sleep(500);
    }

    globalRegisterS.set("DEVICE_STATE", "0");
}

// 객실 상태 변경
var _setRoomReq = function(params) {
    /* params
    {
    lcu: 1,               // 0x00 모든 LCU
    rcu: 1,               // 0x00 모든 RCU
    reserved: 0xff,       // 예약
    room: {
      state: 0xff,        // 객실 상태
      temp: 0xff,         // 설정 온도
      sensor1: 0xff,      // 객실센서1
      sensor2: 0xff,      // 객실센서2
      sensor3: 0xff,      // 객실센서3
      light: 0xff,        // 전등상태
      etc: 0xff,          // 기타명령(청소지시)
      aircon: 0xff,       // 냉난방기제어
      vt: 0xff            // 보이스터미널
    }
    }
    */
    // 파라메터 디폴트 값
    var jsonObj = {
        lcu                 : 0xff,         // 0x00 모든 LCU
        rcu                 : 0xff,         // 0x00 모든 RCU
        reserved            : 0xff,         // 예약
        room: {
            state           : 0xff,         // 객실 상태
            temp            : 0xff,         // 설정 온도
            sensor1         : 0xff,         // 객실센서1
            sensor2         : 0xff,         // 객실센서2
            sensor3         : 0xff,         // 객실센서3
            light           : 0xff,         // 전등상태
            etc             : 0xff,         // 기타명령(청소지시)
            aircon          : 0xff,         // 냉난방기제어
            vt              : 0xff          // 보이스터미널
        }
    };

    // 파라메터 세팅
    if(!util.isUndefinedAnull(params.lcu))              jsonObj.lcu             = params.lcu;
    if(!util.isUndefinedAnull(params.rcu))              jsonObj.rcu             = params.rcu;
    if(!util.isUndefinedAnull(params.reserved))         jsonObj.reserved        = params.reserved;
    if(!util.isUndefinedAnull(params.room.state))       jsonObj.room.state      = params.room.state;
    if(!util.isUndefinedAnull(params.room.temp))        jsonObj.room.temp       = params.room.temp;
    if(!util.isUndefinedAnull(params.room.sensor1))     jsonObj.room.sensor1    = params.room.sensor1;
    if(!util.isUndefinedAnull(params.room.sensor2))     jsonObj.room.sensor2    = params.room.sensor2;
    if(!util.isUndefinedAnull(params.room.sensor3))     jsonObj.room.sensor3    = params.room.sensor3;
    if(!util.isUndefinedAnull(params.room.light))       jsonObj.room.light      = params.room.light;
    if(!util.isUndefinedAnull(params.room.etc))         jsonObj.room.etc        = params.room.etc;
    if(!util.isUndefinedAnull(params.room.aircon))      jsonObj.room.aircon     = params.room.aircon;
    if(!util.isUndefinedAnull(params.room.vt))          jsonObj.room.vt         = params.room.vt;

    var buff = rcCommandFactory.create(CMD_TYPE.SET_ROOM_REQ, jsonObj);
    comm.write(buff);
    debug.info(STATE.SET_ROOM_SUCCESS.M + ", " + JSON.stringify(params));
}

// 객실 상태 요청
var _getRoomReq = function(params) {
    /* params
    {
        lcu: 1,               // LCU
        rcu: 1,               // RCU
    }
    */
    // 파라메터 디폴트 값
    var jsonObj = {
        lcu                 : 0xff,         // LCU
        rcu                 : 0xff,         // RCU
    };

    // 파라메터 세팅
    if(!util.isUndefinedAnull(params.lcu))  jsonObj.lcu     = params.lcu;
    if(!util.isUndefinedAnull(params.rcu))  jsonObj.rcu     = params.rcu;

    var buff = rcCommandFactory.create(CMD_TYPE.GET_ROOM_REQ, jsonObj);
    comm.write(buff);
    debug.info(STATE.GET_ROOM_SUCCESS.M + ", " + JSON.stringify(params));
}

// 디바이스 정보 요청 응답 함수
var _deviceInfoRep = function(data) {
    var jsonLcu = rcParserFactory.create(CMD_TYPE.DEVICE_INFO_REP, data);
    deviceMapS.add(jsonLcu.no, jsonLcu);
    debug.info(STATE.ADD_DEVICE_INFO.M + ", LCU: " + jsonLcu.no);
}

// 객실 설정 요청 응답 함수
var _setRoomRep = function(data) {
    var jsonRep = rcParserFactory.create(CMD_TYPE.SET_ROOM_REP, data);
    if(1 != jsonRep.error) {
        // 에러지 뭘 뭔가 잘못되었어
        debug.error(STATE.SET_ROOM_FAIL.M + ", CODE: " + jsonRep.error);
    }
/*
    else {
        // 오케이여 성공한겨
        debug.info(STATE.SET_ROOM_SUCCESS.M);
    }
*/
}

// 객실 정보 요청 응답 함수
var _getRoomRep = function(data) {
    var jsonRep = rcParserFactory.create(CMD_TYPE.GET_ROOM_REP, data);
    try {
        var deviceList  = deviceMapS.all();
        for(var i=0; i<jsonRep.length; i++) {
            for(lcu in deviceList) {
                for(rcu in deviceList[lcu].rcu) {
                    if(deviceList[lcu].no == jsonRep[i].lcu &&
                        deviceList[lcu].rcu[rcu].no == jsonRep[i].rcu) {
                        deviceList[lcu].rcu[rcu].state = jsonRep[i].state;
    //                    debug.info("LCU: " + deviceList[lcu].no + ", RCU: " + deviceList[lcu].rcu[rcu].no + " <= " + "LCU: " + jsonRep[i].lcu + ", RCU: " + jsonRep[i].rcu);
                        break;
                    }
                }
            }
        }
    }
    catch(ex) {
        // 디바이스 정보가 없는거지 응응 정확히 말하면 에러는 아니지만 로직을 그렇게 짜지 않을테니
        // 에러로 표시 하자
        debug.error(STATE.ADD_ROOM_STATE_FAIL.M + ", LCU: " + jsonRep.lcu + ", RCU: " + jsonRep.rcu);
    }
}

// 디바이스 정보 리셋
var _deviceListClear = function() {
    deviceMapS.clear();
}

// 싱글톤으로 만들기 위한 시작점
var singleton = function singleton() {
    // 버퍼링용 임시 버퍼
    var recvBuffer = new Buffer(0);
	// 시리얼 포트에 데이터가 들어 오면 호출되는 콜백 함수
	this.dataReceived =  function(data) {
        // 임시 버퍼에 현재 들어온 데이터와 기존 데이터를 합처서 넣는다.
        recvBuffer      = Buffer.concat([recvBuffer, data], recvBuffer.length + data.length);        

        // 데이터 사이즈
        var dataSize    = recvBuffer.length;

        // 시리얼 데이터 추적의 핵심이 될 로그일 꺼야 -_-후훗
//        debug.info(STATE.SERIAL_DATA_RECEIVED.M + ", " + data.toString('hex') + ", " + data.length + " Byte");
//        debug.info(STATE.SERIAL_DATA_RECEIVED.M);
//        debug.info("RX: " + data.toString('hex') + ", " + data.length + " Byte");
        debug.info("RX ROW: " + data.toString('hex'));

        // 만약 윈도우라면 recvBuffer에 바로 모든 데이터가 들어올꺼고 리눅스 계열이라면 계속 쌓이겠지?
        if(0 <= recvBuffer.indexOf(CMD_TYPE.STX) && 0 <= recvBuffer.indexOf(CMD_TYPE.ETX)) {
            // 무결성 검사도 완료합시다.
            var crcBuff = new Buffer(2);
            crcBuff.writeUInt16BE(crc.crc16modbus(recvBuffer.slice(0, dataSize - 2)), 0);
            if(crcBuff[0] == recvBuffer[dataSize - 2] && crcBuff[1] == recvBuffer[dataSize - 1]) {
                // 어머 CRC 체크섬 까지 완벽하군요
//                debug.info(STATE.SERIAL_CRC_CHECK_SUCCESS.M + ", " + recvBuffer.toString('hex'));
                debug.info(STATE.SERIAL_CRC_CHECK_SUCCESS.M);
                debug.info("RX: " + recvBuffer.toString('hex'));

                // 무엇이든 물어보세요~~
                switch(recvBuffer[1]) {
                    // 디바이스 정보 응답
                    case CMD_TYPE.DEVICE_INFO_REP:
                        _deviceInfoRep(recvBuffer);
                        break;
                    // 객실 정보 설정 응답
                    case CMD_TYPE.SET_ROOM_REP:
                        _setRoomRep(recvBuffer);
                        break;
                    // 객실 상태 요청 응답
                    case CMD_TYPE.GET_ROOM_REP:
                        _getRoomRep(recvBuffer);
                        break;
                    default:
                    // 정의되지 않은 커맨드
                        debug.error(STATE.COMMAND_TYPE_NOT_DEFINED.M + ": 0x" + recvBuffer[1].toString(16));
                        break;
                }
            }
            else {
                debug.error(STATE.SERIAL_CRC_CHECK_FAIL.M + ", " + recvBuffer.toString('hex'));
            }

            // 프로토콜 버퍼가 완성된 시점에서 초기화
            recvBuffer = new Buffer(0);
        }

        // 쌓여진 버퍼에 STX 비트가 없으면 버퍼를 삭제한다.
        if(!(0 <= recvBuffer.indexOf(CMD_TYPE.STX))) {
            recvBuffer = new Buffer(0);
        }

        // 맥스 버퍼 사이즈가 넘어 가면 버퍼 초기화
        if(config.RC_SERVER.RECV_MAX_BUFF_SIZE < recvBuffer.length) {
            recvBuffer = new Buffer(0);
        }

        // 근데 만약... 프로토콜 규약에 맞지 않는 버퍼가 계속 쌓인다면?? 짱나것지??
        /*
        if( (config.RC_SERVER.RECV_MAX_BUFF_SIZE < recvBuffer.length)  &&               // 맥스 버퍼 사이즈가 넘어 가면 그때부터 썅 눈 뒤집는겨
            (recvBuffer[0] != CMD_TYPE.STX)                            &&               // STX 도 없어??
            (recvBuffer[dataSize - 3] != CMD_TYPE.ETX)) {                               // ETX 까지 없어??
            debug.error(STATE.SERIAL_GARBAGE_DATA.M + ", " + recvBuffer.toString('hex'));
            recvBuffer = new Buffer(0);                                                 // 초기화 시켜 버리자
        }
        */
	}

    // 시작!!
    this.start = function(portName, baudrate) {
        if((util.isUndefinedAnull(portName) || "" == portName) ||
            util.isUndefinedAnull(baudrate)) {
        	debug.error(STATE.INVALID_PARAMETER.M);
        	return STATE.INVALID_PARAMETER.C;
        }

        if(1 != config.RC_SERVER.ONLINE) {
            return STATE.SERVICE_NOT_USE.C;
        }

        var state = comm.open(portName, baudrate, this.dataReceived);
        if(0 > state) {
        	return state;
        }

        // 백그라운드 동작
        setTimeout(function() {
            // 디바이스 목록
            _deviceScanReq();

            // 디바이스 상태
            _deviceStateReq();
        }, 0);

        // 주기적으로 디바이스 목록 스캔
        setInterval(function() {
            if(0 == globalRegisterS.get("DEVICE_SCAN") &&
                0 == globalRegisterS.get("DEVICE_STATE")) {
                // 디바이스 목록을 스캔하는거야
                _deviceScanReq();
            }

        }, config.RC_SERVER.DEVICE_SCAN_DELAY);

        // 주기적으로 상태 정보 스캔
        setInterval(function() {
            if(0 == globalRegisterS.get("DEVICE_SCAN") &&
                0 == globalRegisterS.get("DEVICE_STATE")) {
                // 디바이스 상태를 스캔하는거야
                _deviceStateReq();
            }

        }, config.RC_SERVER.STATE_SCAN_DELAY);

        debug.info(STATE.SERIAL_SERVICE_SUCCESS.M + ", " + portName + ", " + baudrate);
        return STATE.SERIAL_SERVICE_SUCCESS.C;
    }

    // 외부에서 제어되는 API 정의
    // 디바이스 목록 검색한다.
    this.deviceScan = function() {
        return _deviceScanReq();
    }

    // 디바이스 상태 가져오기
    this.deviceState = function() {
        return _deviceStateReq();
    }

    // 객실 상태 변경
    this.setRoom = function(params) {
        /* params
        {
            lcu                 : 1,            // 0x00 모든 LCU
            rcu                 : 1,            // 0x00 모든 RCU
            reserved            : 0xff,         // 예약
            room : {
                state           : 0xff,         // 객실 상태
                temp            : 0xff,         // 설정 온도
                sensor1         : 0xff,         // 객실센서1
                sensor2         : 0xff,         // 객실센서2
                sensor3         : 0xff,         // 객실센서3
                light           : 0xff,         // 전등상태
                etc             : 0xff,         // 기타명령(청소지시)
                aircon          : 0xff,         // 냉난방기제어
                vt              : 0xff          // 보이스터미널
            }
        }
        */
        return _setRoomReq(params);
    }

    // 객실 상태 요청
    this.getRoom = function(params) {
        return _getRoomReq(params);
    }
}

singleton.instance = null;

singleton.getInstance = function() {
    // 만약 객체가 생성되어 있지 않다면 생성해서 넘겨 주고 생성되어 있다면
    // 기존 객체를 넘겨 준다.
    if(this.instance === null) this.instance = new singleton();
    return this.instance;
}

module.exports = singleton.getInstance();
