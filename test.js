const io = require('socket.io-client');
const socket = io('http://localhost:2000');

socket.on("connect", function () {
   console.log("Device Connection!");

   socket.emit("jsonFormat", {name:"TOM", age: 20});

   socket.on("disconnect", function(){
       console.log("Device Disconnected!");
   });

   socket.on('roomEvent', function (data) {
      console.log(data);
   });

   socket.on("clientHello", function (data) {
       console.log(data);
   });
});
