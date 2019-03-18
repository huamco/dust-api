const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const PacketParams = mongoose.model('PacketParams');

// Index
router.get('/getElectData',
    function(req, res, next){
        const now = new Date();
        PacketParams.aggregate([
            {
                $project: {
                    year: {
                        $year: '$createDate'
                    },
                    month: {
                        $month: '$createDate'
                    },
                    day: {
                        $dayOfMonth: '$createDate'
                    },
                    m_fParam_power: 1,
                    m_wPressure: 1,
                    createDate: 1
                }
            },
            {
                $match: {
                    year: now.getFullYear(),
                    month: (now.getMonth()+1),
                    day: now.getDate()
                }
            },
            {
                $group : {
                    _id: {
                        dateTime: { $dateToString: { format: '%Y-%m-%dT%H', date: '$createDate', timezone: 'Asia/Seoul' } }
                    },
                    data: {
                        $push: {
                            m_fParam_power: '$m_fParam_power',
                            m_wPressure: '$m_wPressure',
                            createDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$createDate', timezone: 'Asia/Seoul' } }
                        }
                    }
                }
            },
            {
                $sort: { '_id.dateTime': 1 }
            },
            {
                $project: {
                    _id: 1,
                    data: { $arrayElemAt: [ '$data', -1 ] },
                }
            }
        ]).allowDiskUse(true).exec(function(err, result){
            if(err) throw err;
             //console.log(result);

            /*var json2xls = require('json2xls');
            var file = require('file-system');
            var fs = require('fs');
            var xls = json2xls(result);
            //console.log(xls);
            file.writeFileSync('data.xlsx', xls, 'binary');*/

            res.json(result);

        });
    }
);

//일별 전력량 m_fParam_power, createDate
//현재 일의 시간별 데이터중  마지막 데이터 기준
router.get('/getDailyPower',
    function(req, res, next){
        const now = new Date();

    }
);

//월별 전력량 m_fParam_power, createDate
//현재 달의 Daily데이터중  마지막 데이터 기준
router.get('/getMonthlyPower',
    function(req, res, next){
        const now = new Date();

    }
);

//월별 전력 SUM m_fParam_power
//현재 달의 Daily데이터중  마지막 데이터 기준 SUM
router.get('/getMonthlyPowerSum',
    function(req, res, next){
        const now = new Date();
    }
);

//일별 전력  SUM m_fParam_power
//현재 일의 시간별 데이터중  마지막 데이터 기준 SUM
router.get('/getDailyPowerSum',
);

/*
param : 시작일, 종료일
output : 집진기명, 알람내용, 발생시작일, 발생종료일
m_byaAlarm_history : 배열값 중에  0 이 아닌값이 들어오면 알람발생일 출력,  0이 들어오면 알람종료일 출력
집진기명 : dust 모델의 dustName
알람내용 : m_byaAlarm_history
* */
//알람 목록
router.get('/getAlarmList',
    function(req, res, next){
        PacketParams.aggregate([
            {
                $project: {
                    year: {
                        $year: '$createDate'
                    },
                    month: {
                        $month: '$createDate'
                    },
                    day: {
                        $dayOfMonth: '$createDate'
                    },
                    m_byaAlarm_history: 1,
                    createDate: 1
                }
            },
            {
                $match: {
                    year: now.getFullYear(),
                    month: (now.getMonth()+1),
                    day: now.getDate()
                }
            },
            {
                $group : {
                    _id: {
                        dateTime: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S', date: '$createDate', timezone: 'Asia/Seoul' } }
                        /*,
                        totalAmount: {$sum: '$m_fParam_power'}*/
                    },
                    data: {
                        $push: {
                            m_fParam_power: '$m_fParam_power',
                            m_wPressure: '$m_wPressure',
                            createDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S', date: '$createDate', timezone: 'Asia/Seoul' } }
                        }
                    }
                }
            },
            {
                $sort: { '_id.dateTime': 1 }
            },
            {
                $project: {
                    _id: 1,
                    data: { $arrayElemAt: [ '$data', -1 ] },
                }
            }
        ]).allowDiskUse(true).exec(function(err, result){
            if(err) throw err;
            console.log(result);
            res.json(result)
        });
    }
);

/*
param : 시작일, 종료일
output : 집진기명(dustName), 타입(m_byType) , 전압(m_wPower_value), 차압(m_wPressure),
        전류(m_waCurrent_nowx10): m_waCurrent_nowx10[0]/10 ,
        전력(m_fParam_power)
        , 인버터(m_byReserved): m_byReserved[3],
날짜별로 마지막 데이터 기준
* */
//패킷데이터 로그 목록
router.get('/getReportData',
    function(req, res, next){
        PacketParams.aggregate([
            {
                $project: {
                    year: {
                        $year: '$createDate'
                    },
                    month: {
                        $month: '$createDate'
                    },
                    day: {
                        $dayOfMonth: '$createDate'
                    },
                    m_byaAlarm_history: 1,
                    createDate: 1
                }
            },
            {
                $match: {
                    year: now.getFullYear(),
                    month: (now.getMonth()+1),
                    day: now.getDate()
                }
            },
            {
                $group : {
                    _id: {
                        dateTime: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S', date: '$createDate', timezone: 'Asia/Seoul' } }
                        /*,
                        totalAmount: {$sum: '$m_fParam_power'}*/
                    },
                    data: {
                        $push: {
                            m_fParam_power: '$m_fParam_power',
                            m_wPressure: '$m_wPressure',
                            createDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S', date: '$createDate', timezone: 'Asia/Seoul' } }
                        }
                    }
                }
            },
            {
                $sort: { '_id.dateTime': 1 }
            },
            {
                $project: {
                    _id: 1,
                    data: { $arrayElemAt: [ '$data', -1 ] },
                }
            }
        ]).allowDiskUse(true).exec(function(err, result){
            if(err) throw err;
            console.log(result);
            res.json(result)
        });
    }
);

module.exports = router;
