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
            console.log(result);
            res.json(result)
        });
    }
);

module.exports = router;
