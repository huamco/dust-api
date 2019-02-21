const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const mongoose   = require('mongoose');
const net = require('net');
const http = require('http').createServer(express);
const io = require('socket.io')(http);

const app = express();

let data1 = '';

const client = net.connect({port:8124, host:'127.0.0.1'}, function(){
    console.log('Client connected 8124');
    //client.write('Some Data \r\n');
});

client.on('data', function(data){

  data1 = data;
  console.log(data);
  console.log(data.toString('hex'));
  console.log(data1);

  // var sz = this.merge ? this.merge + data.toString() : data.toString();
  // //console.log(sz);
  // var arr = sz.split('¶');
  // for (var n in arr) {
  //     if (sz.charAt(sz.length - 1) != '¶' && n == arr.length - 1) {
  //         this.merge = arr[n];
  //         break;
  //     } else if (arr[n] == "") {
  //         break;
  //     } else {
  //         this.onRead(this.options, JSON.parse(arr[n]));
  //
  //         this.merge = null;  //이전 버퍼 저장 오류 보완
  //     }
  // }

    client.write(data);
    client.end();
});

client.on('end', function(){
    console.log('Client disconnected');
});
