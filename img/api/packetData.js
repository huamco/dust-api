const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const PacketParams     = require('../models/packetParams');
const moment = require('moment');

// Index
router.get('/getElectData',
    function(req, res, next){
        var arr = [];
        var tomorrowDate = moment(new Date()).add(-10, 'days').format("YYYY-MM-DD");
        //console.log('tomorrowDate==>',tomorrowDate);
        MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, function (err, client) {
            var db = client.db('hac');
            db.collection('PacketParams')
                .aggregate([
                    {
                        $group : {
                            _id: {
                                dateTime: { $dateToString: { format: "%Y-%m-%dT%H", date: "$createDate", timezone: "Asia/Seoul" } }
                            },
                            data: {
                                $addToSet: {
                                    m_fParam_power: '$m_fParam_power',
                                    m_wAuto_puls_val: '$m_stRunParam.m_wAuto_puls_val',
                                    createDate: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createDate", timezone: "Asia/Seoul" } }
                                }
                            }
                        }
                    },
                    {
                        $sort: { '_id.dateTime': 1 }
                    }
                ])
                .forEach((c)=>{
                    /*,
                                dustId: '$dustId'*/
                    if(c.data && c.data.length){
                        c.data.sort(function(a,b){
                            return new Date(a.createDate) - new Date(b.createDate);
                        });
                    }
                    arr.push(c);
                }).then(()=>{
                res.send(arr);
            });
        });
    }
);

router.get('/getSocketData',
    function(req, res, next){
        var arr = [];
        var hexStream = require('../server/hexStreamGenerator');
        /*var hexBuffer = null;
            MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, function (err, client) {
            var db1 = client.db('hac');
            db1.collection('PacketParams').find().limit(100).sort({"createDate": 1}).forEach((c)=>{
                hexBuffer = hexStream.jsonToHex(JSON.stringify(c));
                console.log(hexBuffer);
                arr.push(hexBuffer);
            }).then(()=>{
                //console.log("arr", arr);
                res.send(hexBuffer);
            });
        });*/
    }
);

module.exports = router;
