module.exports = function(app){
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    // 클라이언트로 이벤트 보내기
    io.emit("ID_REGISTRATION", "ID_REGISTATION_PROCESS");

    // 소켓 연결 시 이벤트
    io.on('connection', function (socket) {
        // 패킷데이터 관련 소켓 이벤트
        require('./packetData.socket')(io, socket);

    });

    // 소켓 통신 연결 포트 오픈
    http.listen(2000, function(){
        console.log("Socket.io Server Listen 2000");
        // DEVICE SERVER
        require('../device');
    });
};
