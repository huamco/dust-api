const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const PacketParams = mongoose.model('PacketParams');
var json2xls = require('json2xls');
var Excel = require('exceljs');
var fs = require('fs');

var moment = require('moment');

const getParamDataHour = async ({compDateYYYY=null, compDateYYYYMM=null, compDateYYYYMMDD=null, snId}) => {
    compDateYYYY = parseInt(compDateYYYY);
    compDateYYYYMM = parseInt(compDateYYYYMM);
    compDateYYYYMMDD = parseInt(compDateYYYYMMDD);
    // console.log(compDateYYYY.toString(),compDateYYYYMM.toString(),compDateYYYYMMDD.toString())
    const results = await PacketParams.aggregate([
        {
            $match: {
                'm_stSysParam.m_wEth_id': snId,
                'createDateYYYYMMDD' : compDateYYYY
            }
        },
        {
            $group : {
                _id: {
                    dateTime:  '$createDateYYYYMMDDHH'
                },
                data: {
                    $push: {
                        m_fParam_power: '$m_fParam_power',
                        m_wPressure: '$m_wPressure',
                        createDate:'$dateTime'
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
    ]).allowDiskUse(true).catch((e)=> {
        console.log('PacketParams.aggregate');
        console.log(e);
        console.log(e.toString());
    });
console.log(results);
    return results;
};

const getParamDataDaily = async ({compDateYYYY, compDateYYYYMM, compDateYYYYMMDD, snId}) =>     {
    compDateYYYY = parseInt(compDateYYYY);
    // console.log('getParamDataDaily==>', compDateYYYY , compDateYYYYMM, compDateYYYYMMDD);
    const results = await PacketParams.aggregate([
        {
            $match: {
                'm_stSysParam.m_wEth_id': snId,
                createDateYYYYMM : compDateYYYY
            }
        },
        {
            $group : {
                _id: {
                    dateTime:  '$createDateYYYYMMDD'
                    ,m_wEth_id: '$m_stSysParam.m_wEth_id'
                },
                data: {
                    $push: {
                        m_fParam_power: '$m_fParam_power',
                        m_wPressure: '$m_wPressure',
                        /*m_wEth_id: '$m_stSysParam.m_wEth_id',*/
                        /* createDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$createDate', timezone: 'Asia/Seoul' } }*/
                        createDate:'$dateTime'
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
    ]).allowDiskUse(true).catch((e)=> {
        console.log('PacketParams.aggregate');
        console.log(e);
        console.log(e.toString());
    });
    // console.log(results);
    return results;
};

const getParamDataMonthly = async ({compDateYYYY , compDateYYYYMM, compDateYYYYMMDD, snId}) => {
    // console.log('getParamDataMonthly==>', compDateYYYY , compDateYYYYMM, compDateYYYYMMDD);
    compDateYYYY = parseInt(compDateYYYY);
    const results = await PacketParams.aggregate([
        {
            $match: {
                'm_stSysParam.m_wEth_id': snId,
                createDateYYYY : compDateYYYY
            }
        },
        {
            $group : {
                _id: {
                    dateTime:  '$createDateYYYYMM'
                    ,m_wEth_id: '$m_stSysParam.m_wEth_id'
                },
                data: {
                    $push: {
                        m_fParam_power: '$m_fParam_power',
                        m_wPressure: '$m_wPressure',
                        /*m_wEth_id: '$m_stSysParam.m_wEth_id',*/
                        /* createDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$createDate', timezone: 'Asia/Seoul' } }*/
                        createDate:'$dateTime'
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
    ]).allowDiskUse(true).catch((e)=> {
        console.log('PacketParams.aggregate');
        console.log(e);
        console.log(e.toString());
    });
    // console.log(results);
    return results;
};

const getParamDataMonthlySum = async ({compDate = null}) => {
    compDate = parseInt(compDate);
    const results = await PacketParams.aggregate([
        {
            $match: {
                createDateYYYYMM : compDate
            }
        },
        {
            $group : {
                _id: {
                    dateTime: '$createDateYYYYMM'
                },
                data: {
                    $push: {
                        m_fParam_power: '$m_fParam_power'
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                data: { $arrayElemAt: [ '$data', -1 ] },
            }
        }
    ]).allowDiskUse(true).catch((e)=> {
        console.log(' getParamDataMonthlySum PacketParams.aggregate');
        console.log(e);
        console.log(e.toString());
    });
    // console.log(results);
    return results;
};

const getParamDataDailySum = async ({compDate = null}) => {
    compDate = parseInt(compDate);
    const results = await PacketParams.aggregate([
        {
            $match: {
                createDateYYYYMMDD : compDate
            }
        },
        {
            $group : {
                _id: {
                    dateTime: '$createDateYYYYMMDD'
                },
                data: {
                    $push: {
                        m_fParam_power: '$m_fParam_power'
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                data: { $arrayElemAt: [ '$data', -1 ] },
            }
        }
    ]).allowDiskUse(true).catch((e)=> {
        console.log(' getParamDataMonthlySum PacketParams.aggregate');
        console.log(e);
        console.log(e.toString());
    });
    // console.log(results);
    return results;
};

// Index
router.get('/getElectData/:snId',
    async (req, res, next) => {
    /*console.log(moment(new Date()).format('YYYY'));
        console.log(moment(new Date()).format('MM'));
        console.log(moment(new Date()).format('DD'));*/
        const results = await getParamDataHour({
            // date: req.query.date
            // date: moment(new Date()).format('YYYYMMDD'),
            /*compDateYYYY: moment(new Date()).format('YYYY'),
            compDateYYYYMM: moment(new Date()).format('MM'),
            compDateYYYYMMDD: moment(new Date()).format('DD'),*/
            compDateYYYY: moment(new Date()).format('YYYYMMDD'),
            compDateYYYYMM: 4,
            compDateYYYYMMDD: 19,
            snId: req.params.snId
        });
        res.json(results);
    }
);

//일별 전력량 m_fParam_power, createDate
//현재 일의 시간별 데이터중  마지막 데이터 기준
router.get('/getDailyPower/:snId',
    async (req, res, next) => {
        const results = await getParamDataDaily({
            // date: req.query.date
            //date:moment(new Date()).format('YYYYMMDD'),
            compDateYYYY: moment(new Date()).format('YYYYMM'),
            compDateYYYYMM: 4,
            compDateYYYYMMDD: 19,
            snId: req.params.snId
        });
        res.json(results);
    }
);

//월별 전력량 m_fParam_power, createDate
//현재 달의 Daily데이터중  마지막 데이터 기준
router.get('/getMonthlyPower/:snId',
    async (req, res, next) => {
        const results = await getParamDataMonthly({
            // date: req.query.date
            // date: moment(new Date()).format('YYYY-MM-DD'),
            compDateYYYY: moment(new Date()).format('YYYY'),
            compDateYYYYMM: 4,
            compDateYYYYMMDD: 19,
            snId: req.params.snId
        });
        res.json(results);
    }
);

//월별 전력 SUM m_fParam_power
//현재 달의 Daily데이터중  마지막 데이터 기준 SUM
router.get('/getMonthlyPowerSum',
    async (req, res, next) => {
        const results = await getParamDataMonthlySum({
            // date: req.query.date
            // date:moment(new Date()).format('YYYY-MM-DD')
            compDate: moment(new Date()).format('YYYYMM')
        });

        let val = 0.0;
        if(results && results.length){
            for(let i=0; i<results.length; i++){
                val += parseFloat(results[i].data.m_fParam_power);
            }
        }
        res.json({data: { m_fParam_power: val }});
    }
);

//일별 전력  SUM m_fParam_power
//현재 일의 시간별 데이터중  마지막 데이터 기준 SUM
router.get('/getDailyPowerSum',
    async (req, res, next) => {
        const results = await getParamDataDailySum({
            // date: req.query.date
            // date:moment(new Date()).format('YYYY-MM-DD'),
            compDate: moment(new Date()).format('YYYYMMDD')
        });

        let val = 0.0;
        if(results && results.length){
            for(let i=0; i<results.length; i++){
                val += parseFloat(results[i].data.m_fParam_power);
            }
        }
        res.json({data: { m_fParam_power: val }});
    }
);
/*
param : 시작일, 종료일
output : 집진기명, 알람내용, 발생시작일, 발생종료일
m_byaAlarm_history : 배열값 중에  0 이 아닌값이 들어오면 알람발생일 출력, 0이 들어오면 알람종료일 출력
집진기명 : dust 모델의 dustName
알람내용 : m_byaAlarm_history
* */
//알람 목록
/*const getHistories = async (sDate, eDate, historyIdx,) => {
    const results = await PacketParams.aggregate([
        {
            $match: {
                createDate: { $gte: sDate, $lte: eDate },
            }
        },
        {
            $project: {
                _id: 1,
                dustId: 1,
                dustName: 1,
                createDate: 1,
                history: { $arrayElemAt: [ '$m_byaAlarm_history', historyIdx ] },
            }
        },
        {
            $sort: { 'createDate': 1 }
        },
        {
            $group: {
                _id: {
                    dateTime: { $dateToString: { format: '%Y-%m-%d', date: '$createDate', timezone: 'Asia/Seoul' } },
                    dustId: '$dustId',
                    dustName: '$dustName',
                },
                historyGroup: {
                    $push: {
                        val: '$history', date: '$createDate'
                    }
                },
            }
        },
        {
            $sort: { '_id.dateTime': 1 }
        }
    ]).allowDiskUse(true);
    return results;
};*/

/*router.get('/getAlarmList',
    async (req, res, next) => {
        const sDate = new Date(2019, 3, 1);
        const eDate = new Date(2019, 3, 31);

        const histories = [];
        for(let i=0; i<5; i++){
            const history = await getHistories(sDate, eDate, i);
            histories.push(history);
        }

        const func = (result) => {
            const historyGroup = result.historyGroup;
            let val = {};
            val[result._id.dateTime] = [];
            let idx = 0;
            for(let j=0; j<historyGroup.length; j++){
                const data = historyGroup[j];

                if(data.val === '0' && val[result._id.dateTime][idx] && val[result._id.dateTime][idx].sDate && !val[result._id.dateTime][idx].eDate){
                    val[result._id.dateTime][idx].eDate = data.date;
                    idx++;
                }else if(data.val !== '0' && !val[result._id.dateTime][idx]){
                    val[result._id.dateTime].push({
                        value: data.val,
                        sDate: data.date,
                        eDate: null
                    });
                }
            }
            return val;
        };
        const returnVal = {
            'history0': {},
            'history1': {},
            'history2': {},
            'history3': {},
            'history4': {},
        };
        for(let i=0; i<histories.length; i++){
            const results = histories[i];
            const val = [];
            for(let j=0; j<results.length; j++) {
                val.push(await func(results[j]));
            }
            returnVal['history'+i] = val;
        }
        res.json(returnVal);
    }
);*/

const getHistories = async (sDate, eDate, snId) => {
    sDate = parseInt(sDate);
    const results = await PacketParams.aggregate([
        {
            $match: {
                'm_stSysParam.m_wEth_id': snId,
                'createDateYYYYMMDD' : sDate
            }
        },
        {
            $group : {
                _id: {
                    dateTime:  '$createDateYYYYMMDD'
                },
                data: {
                    $push: {
                        m_byaAlarm_history: '$m_byaAlarm_history',
                        m_byReserved: '$m_byReserved',
                        m_wEth_id: '$m_stSysParam.m_wEth_id',
                        createDate:'$dateTime'
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
    ]).allowDiskUse(true);
    //console.log(results);
    return results;
};

router.get('/getAlarmList/:snId',
    async (req, res, next) => {
        const sDate = moment(new Date()).format('YYYYMMDD');
        const eDate = new Date(2019, 3, 31);
        const snId = req.params.snId;
        const history = await getHistories(sDate, eDate, snId);
        res.json(history);
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
router.get('/getReportData/:snId',
    async (req, res, next) => {
        const sDate = parseInt(moment(new Date(req.query['startDate'])).format('YYYYMMDD'));
        const eDate = parseInt(moment(new Date(req.query['endDate'])).format('YYYYMMDD'));
        const isAlarm =req.query['isAlarmList'];
        const snId = req.params.snId;

        const results = await PacketParams.aggregate([
            {
                $match: {
                    createDateYYYYMMDD: { $gte: sDate, $lte: eDate },
                    'm_stSysParam.m_wEth_id': snId
                }
            },
            {
                $group : {
                    _id: {
                        dateTime: '$createDateYYYYMMDD',
                        m_wEth_id: '$m_stSysParam.m_wEth_id'
                    },
                    data: {
                        $push: {
                            m_byType: '$m_stSysParam.m_byType',
                            m_wPower_value: '$m_stSysParam.m_wPower_value',
                            /*m_waCurrent_nowx10: '$m_waCurrent_nowx10',
                            m_byReserved: '$m_byReserved',*/
                            m_fParam_power: '$m_fParam_power',
                            m_wPressure: '$m_wPressure',
                            createDate: '$dateTime'
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
        ]).allowDiskUse(true).then( data => {
            const templates ={
                report_data: {
                    fields: ['전력', '전압' , '차압']
                }
            };
            //console.log(data);

            var workbook = new Excel.Workbook();
            var worksheet = workbook.addWorksheet('report');
            worksheet.columns = [
                { header: '타입', key: 'm_byType'},
                { header: '전력', key: 'm_wPower_value'},
                { header: '전압', key: 'm_wPressure'},
                { header: '날짜', key: 'createDate' }
            ];
            if(data) {
                data.forEach( r => {
                    worksheet.addRow({
                        m_byType: r.data.m_byType,
                        m_wPower_value: r.data.m_wPower_value,
                        m_wPressure: r.data.m_wPressure,
                        createDate: r.data.createDate,
                    });
                });
            }

            res.setHeader('Content-disposition','attachment: filename=report.xlsx');
            res.setHeader('Content-type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            //console.log(worksheet);
           // workbook.xlsx.write(res);
        });
    }
);

module.exports = router;
