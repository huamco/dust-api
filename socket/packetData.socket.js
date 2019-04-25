const mongoose = require('mongoose');
const PacketParams = mongoose.model('PacketParams');

module.exports = function(io, socket){
    var dataMap = new Map();
    var testArray = [];
    let checkDeviceDataSeq = 0;

    console.log("Socket ID: " + socket.id);
    socket.on('disconnect', function(){
        console.log('app.js bye bye!!!', socket.id);
        console.log("socket disconnected!");
    });

    socket.on('byebye', function(param) {
        console.log('socket byebye:::::::::::');
        socket.broadcast.emit('byebye', param.serialNumber);
        dataMap.delete(param.socketId);
    });

    socket.on('Device-Data', function (bufferData) {
        //console.log('app.js DEVICE ID', bufferData.id);
        //console.log('app.js DEVICE DATA', bufferData.buff);
        //console.log(bufferData.error);
        dataMap.set(bufferData.id, {"socket_id":bufferData.id, "bufferData": bufferData.data, "error": bufferData.error, "buff": bufferData.buff});
        for(var [key, value] of dataMap) {
            testArray.push({"id":key, "data": value});
        }
        const saveLogData = new PacketParams(JSON.parse(bufferData.data));

        if(checkDeviceDataSeq % 5 === 0) {
            saveLogData.save(function (saveErr) {
                if (saveErr) throw saveErr;
            });
            checkDeviceDataSeq = 0;
        }

        io.emit("Device_Monitoring_Data", JSON.stringify(testArray));
        testArray = [];
        checkDeviceDataSeq++;
    });

    socket.on("DeviceSetting", function(data){
        //console.log("[Device Setting!!!]");
        /*console.log(data);
        console.log('::::::::::::::::::::::::::::::::::::::::');
        console.log(socket);
        console.log('#####################################');*/
        io.to(data.socket_id).emit("DeviceSetting2", data);
    });

    socket.on('data', function (message) {
        //console.log('server data=>', message);
        io.emit('message', {type:'new-data', text: message});
    });
}
