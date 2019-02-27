const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const PacketParams  = mongoose.model('PacketParams');

// Index
router.get('/',
    function(req, res, next){
        PacketParams.find({})
            .then((packetParams) => {
                res.json(packetParams);
            }).catch((err) => {
            next(err);
        })
    }
);

// Show
router.get('/:id',
    function(req, res, next){
        getPacketParams(req.params.id).then((packetParams) => {
            res.json(packetParams);
        }).catch((err) => {
            next(err);
        })
    }
);

function getPacketParams(id) {
    return PacketParams.findById(id);
}

// Create
router.post('/',
    function(req, res, next){
    console.log('create PacketParams');
    console.log(req.body);
        PacketParams.findOne({})
            .sort({id: -1})
            .exec(function(err, packetParams){
                if(err) {
                    res.status(500);
                    return res.json({success:false, message:err});
                }
                else {
                    res.locals.lastId = packetParams?packetParams.id:0;
                    next();
                }
            });
    },
    function(req, res, next){
        var newPacketParams = new PacketParams(req.body);
        newPacketParams.id = res.locals.lastId + 1;
        newPacketParams.save(function(err, packetParams){
            if(err) {
                res.status(500);
                res.json({success:false, message:err});
            }
            else {
                res.json({success:true, data:packetParams});
            }
        });
    }
);

// Update
router.put('/:id',
    function(req, res, next){
        console.log('req.params.id==>', req);
        PacketParams.findOneAndUpdate({id:req.params.id}, req.body)
            .exec(function(err, packetParams){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!packetParams){
                    res.json({success:false, message:"packetParams not found"});
                }
                else {
                    res.json({success:true});
                }
            });
    }
);

// Destroy
router.delete('/:id',
    function(req, res, next){
        PacketParams.findOneAndRemove({id:req.params.id})
            .exec(function(err, packetParams){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!packetParams){
                    res.json({success:false, message:"packetParams not found"});
                }
                else {
                    res.json({success:true});
                }
            });
    }
);

module.exports = router;
