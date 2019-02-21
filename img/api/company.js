const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');

//const Company  = mongoose.model('Company');
const Company     = require('../models/company');


// Index
router.get('/',
    function(req, res, next){
        Company.find({})
            .then((companies) => {
                res.json(companies);
            }).catch((err) => {
            next(err);
        })
    }
);

// Show
router.get('/:id',
    function(req, res, next){
        getCompany(req.params.id).then((company) => {
            if (!company) {
                return next(Boom.notFound("Company not found"));
            }
            res.json(company);
        }).catch((err) => {
            next(err);
        })
    }
);

function getCompany(id) {
    return Company.findById(id);
}

// Create
router.post('/',
    function(req, res, next){
        Company.findOne({})
            .sort({id: -1})
            .exec(function(err, company){
                if(err) {
                    res.status(500);
                    return res.json({success:false, message:err});
                }
                else {
                    res.locals.lastId = company?company.id:0;
                    next();
                }
            });
    },
    function(req, res, next){
        var newCompany = new Company(req.body);
        newCompany.id = res.locals.lastId + 1;
        newCompany.save(function(err, company){
            if(err) {
                res.status(500);
                res.json({success:false, message:err});
            }
            else {
                res.json({success:true, data:company});
            }
        });
    }
);

// Update
router.put('/:id',
    function(req, res, next){
    console.log('putputputputputput');
        Company.findOneAndUpdate({id:req.params.id}, req.body)
            .exec(function(err, company){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!company){
                    res.json({success:false, message:"company not found"});
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
        Company.findOneAndRemove({id:req.params.id})
            .exec(function(err, company){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!company){
                    res.json({success:false, message:"company not found"});
                }
                else {
                    res.json({success:true});
                }
            });
    }
);

module.exports = router;
