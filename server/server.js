
'use strict';
const net = require('net');
const tcpClient = require('../client/client.js');
var crc  = require("crc");
var util = require("util");
const { packetParamsSchema } = require('../models/packetParams.js');
//  SOCET.IO
const io = require('socket.io-client');
const editJsonFile = require("edit-json-file");
let file = editJsonFile(`${__dirname}/params.json`);
let stRunParamfile = editJsonFile(`${__dirname}/m_stRunParam.json`);
let stSysParamfile = editJsonFile(`${__dirname}/m_stSysParam.json`);
//console.log(`${__dirname}/params.json`);
/*
* 서버 클래스
*/
class tcpServer {

    constructor(name, port, urls) {
        this.logTcpClient = null; // 로그관리 마이크로서비스 연결 클라이언트
        //서버 상태 정보
        this.context = {
            port: port,
            name: name,
            urls: urls,
        }
        this.merge = {};

        this.chatting_socket = null;
        this.device_socket_ID = null;
        this.users = null;
        this.roomInfo = null;
        // 서버 객체 생성
        this.server = net.createServer((socket) => {
            // 클라이언트 접속 이벤트
            this.onCreate(socket);

            // 에러 이벤트
            socket.on('error', (exception) => {
                this.onClose(socket);
            });

            // 클라이언트 접속 종료 이벤트
            socket.on('close', () => {
                this.onClose(socket);
            });

            // 데이터 수신 이벤트
            socket.on('data', (data) => {
                //var recvBuffer = new Buffer(0);
                // 임시 버퍼에 현재 들어온 데이터와 기존 데이터를 합처서 넣는다.

                //var recvBuffer = new Buffer(data, 'hex');
                var recvBuffer = Buffer.allocUnsafe(data.length);
                recvBuffer = recvBuffer.fill(data, 'hex');
                // 데이터 사이즈
                var dataSize    = recvBuffer.length;

                console.log("RX ROW: " + recvBuffer.toString('hex'));
                console.log("dataSize: " + dataSize);
                //console.log(recvBuffer);
                for (let i = 0; i < recvBuffer.length; i++) {
                    //console.log('recvBuffer==>', recvBuffer[i].toString('hex'));
                }
                //this.socketIO.emit("Device-Data", recvBuffer);
                /*var fs = require('fs');
                var obj = JSON.parse(fs.readFileSync(`${__dirname}/params.json`, 'utf8'));
                var stRunParamObj = JSON.parse(fs.readFileSync(`${__dirname}/stRunParam.json`, 'utf8'));
                var stSysParamObj = JSON.parse(fs.readFileSync(`${__dirname}/m_stSysParam.json`, 'utf8'));
                var keys = Object.keys(obj);
                var stRunParamkeys = Object.keys(stRunParamObj);
                var stSysParamkeys = Object.keys(stSysParamObj);

                let m_byaAlarm_historyArr = [];
                let m_waCurrent_nowx10Arr = [];
                let m_byReservedArr = [];

                let j=0 , k=0, l=0, m=0, n=0, o = 0, g=0, h=0;

                for (let i = 0; i < recvBuffer.length; i++) {
                    //file.set(keys[i], recvBuffer[i].toString(16));
                    //console.log('keys[m]==>', keys[m]);
                    file.set(keys[m], recvBuffer[i]);
                    if(keys[m] === 'm_byaAlarm_history') {
                        for (j = 0; j < 10; j++) {
                            //console.log('j==>', j);
                            m_byaAlarm_historyArr.push(recvBuffer[i+j]);
                        }
                        i = i+j;
                        //console.log('i==>', i);
                        //console.log('m_byaAlarm_historyArr==>', m_byaAlarm_historyArr);
                        file.set('m_byaAlarm_history', m_byaAlarm_historyArr);
                    }
                    /!*if(keys[m] === 'm_wS_mode') {
                        let aa = 0;
                        for (g = 0; g < 4; g++) {
                            //console.log('m_wS_mode[i+g]==>', recvBuffer[i+g]);
                            aa = aa + recvBuffer[i+g];
                        }
                        //console.log(aa);
                        i = i+g;
                        file.set('m_wS_mode', aa);
                    }
                    if(keys[m] === 'm_wM_status') {
                        let aa = 0 ;
                        g =0;
                        for (g = 0; g < 4; g++) {
                            //console.log('m_wM_status[i+g]==>', recvBuffer[i+g]);
                            aa = aa + recvBuffer[i+g];
                        }
                        i = i+g;
                        file.set('m_wM_status', aa);
                    }*!/
                    if(keys[m] === 'm_waCurrent_nowx10') {
                        let aa=0;
                        for (k = 0; k < 4; k++) {
                            //console.log('k==>', k);
                            /!*for (h = 0; h < 2; h++) {
                                //console.log('h==>', h);
                                //console.log('m_waCurrent_nowx10Arr[i+h]==>', recvBuffer[i+h]);
                                aa = aa + recvBuffer[i+h];
                            }*!/
                            m_waCurrent_nowx10Arr.push(recvBuffer[i+k]);
                        }
                        i = i+k;
                        //console.log('i==>', i);
                        //console.log('m_waCurrent_nowx10Arr==>', m_waCurrent_nowx10Arr);
                        file.set('m_waCurrent_nowx10', m_waCurrent_nowx10Arr);
                    }
                    if(keys[m] === 'm_byReserved') {
                        for (l = 0; l < 5; l++) {
                            //console.log('l==>', l);
                            m_byReservedArr.push(recvBuffer[i+l]);
                        }
                        i = i+l;
                        //console.log('i==>', i);
                        //console.log('m_byReservedArr==>', m_byReservedArr);
                        file.set('m_byReserved', m_byReservedArr);
                    }
                    if(keys[m] === 'm_stRunParam') {
                        //console.log(stRunParamkeys[0]);
                        for (n = 0; n < stRunParamkeys.length; n++) {
                            //Object.assign(m_stRunParam_keys[n], recvBuffer[i + n]);
                            stRunParamfile.set(stRunParamkeys[n], recvBuffer[i + n]);
                        }
                        i = i + n;
                        //console.log(stRunParamfile.get());
                        file.set('m_stRunParam', stRunParamfile.get());
                    }
                    if(keys[m] === 'm_stSysParam') {
                        for (o = 0; o < stSysParamkeys.length; o++) {
                           stSysParamfile.set(stSysParamkeys[o], recvBuffer[i + o]);
                        }
                        i = i + o;
                        //console.log(stSysParamfile.get());
                        file.set('m_stSysParam', stSysParamfile.get());
                    }
                    m++;
                }
                //file.save();
                console.log(file.get());*/
                //    Socket.io Server로 전송

            });
        });

        // 서버 객체 에러 이벤트
        this.server.on('error', (err) => {
            console.log(err);
        });

        // 리슨
        this.server.listen(port, () => {
            console.log('listen', this.server.address());
        });
    }

    onCreate(socket) {
        console.log("onCreate", socket.remoteAddress, socket.remotePort);

        this.chatting_socket = io("http://localhost:4200");

        this.chatting_socket.on('ID_REGISTRATION', function(){
           console.log("Device ID:", this.chatting_socket.id);
        });
    }


    onClose(socket) {
        console.log("onClose", socket.remoteAddress, socket.remotePort);
    }

    // Distributor 접속 함수
    connectToDistributor(host, port, onNoti) {

        // Distributor 전달 패킷
        var packet = {
            uri: "/distributes",
            method: "POST",
            key: 0,
            params: this.context
        };
        var isConnectedDistributor = false;

        this.clientDistributor = new tcpClient(
            host
            , port
            , (options) => {                                    // Distributor 접속 이벤트
                isConnectedDistributor = true;
                this.clientDistributor.write(packet);
            }
            , (options, data) => {
                // 로그관리 마이크로서비스 연결
                if (this.logTcpClient == null && this.context.name != 'logs') {
                    for (var n in data.params) {
                        const ms = data.params[n];
                        if (ms.name == 'logs') {
                            this.connectToLog(ms.host, ms.port);
                            break;
                        }
                    }
                }
                onNoti(data);
            }              // Distributor 데이터 수신 이벤트
            , (options) => { isConnectedDistributor = false; }  // Distributor 접속종료 이벤트
            , (options) => { isConnectedDistributor = false; }  // Distributor 통신 에러 이벤트
        );

        // 주기적으로 재접속 시도
        setInterval(() => {
            if (isConnectedDistributor != true) {
                this.clientDistributor.connect();
            }
        }, 3000);
    }

    connectToLog(host, port) {
        this.logTcpClient = new tcpClient(
            host
            , port
            , (options) => { }
            , (options) => { this.logTcpClient = null; }
            , (options) => { this.logTcpClient = null; }
        );
        this.logTcpClient.connect();
    }

    writeLog(log) {
        if (this.logTcpClient) {
            const packet = {
                uri: "/logs",
                method: "POST",
                key: 0,
                params: log
            };
            this.logTcpClient.write(packet);

        } else {
            console.log(log);
        }
    }
}

module.exports = tcpServer;
