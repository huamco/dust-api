const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');

const DustLocation     = require('../models/dustLocation');

// Index
router.get('/',
    function(req, res, next){
        DustLocation.find({})
            .then((dusts) => {
                res.json(dusts);
            }).catch((err) => {
            next(err);
        })
    }
);

// Show
router.get('/:id',
    function(req, res, next){
        getDustLocation(req.params.id).then((dusts) => {
            if (!dusts) {
                return next(Boom.notFound("dusts not found"));
            }
            res.json(dusts);
        }).catch((err) => {
            next(err);
        })
    }
);

function getDustLocation(id) {
    return DustLocation.findById(id);
}

// Create
router.post('/',
    function(req, res, next){
    console.log('create dusts');
        DustLocation.findOne({})
            .sort({id: -1})
            .exec(function(err, dusts){
                if(err) {
                    res.status(500);
                    return res.json({success:false, message:err});
                }
                else {
                    res.locals.lastId = dusts?dusts.id:0;
                    next();
                }
            });
    },
    function(req, res, next){
        var newDustLocation = new DustLocation(req.body);
        newDustLocation.id = res.locals.lastId + 1;
        newDustLocation.save(function(err, dust){
            if(err) {
                res.status(500);
                res.json({success:false, message:err});
            }
            else {
                res.json({success:true, data:dust});
            }
        });
    }
);

// Update
router.put('/:id',
    function(req, res, next){
        console.log('req.params.id==>', req);
        DustLocation.findOneAndUpdate({id:req.params.id}, req.body)
            .exec(function(err, dustLocation){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!dustLocation){
                    res.json({success:false, message:"dustLocation not found"});
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
        DustLocation.findOneAndRemove({id:req.params.id})
            .exec(function(err, dust){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!dust){
                    res.json({success:false, message:"company not found"});
                }
                else {
                    res.json({success:true});
                }
            });
    }
);

module.exports = router;
