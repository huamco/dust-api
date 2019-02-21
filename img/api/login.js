const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');

const User     = require('../models/user');

// Index
router.post('/',
    function(req, res, next){
        User.find({})
            .then((users) => {
                res.json(users);
            }).catch((err) => {
            next(err);
        })
    }
);


module.exports = router;
