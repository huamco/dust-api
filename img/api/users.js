const express  = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User     = require('../models/user');

// Index
router.get('/',
    function(req, res, next){
        User.find({})
            .then((users) => {
                res.json(users);
            }).catch((err) => {
            next(err);
        })
    }
);

// Show
router.get('/:id',
    function(req, res, next){
        getUser(req.params.id).then((user) => {
            if (!user) {
                return next(Boom.notFound("User not found"));
            }
            res.json(user);
        }).catch((err) => {
            next(err);
        })
    }
);

function getUser(id) {
    return User.findById(id);
}

router.post('/authenticate', function (req, res, next) {
    User.findOne({username:req.body.username}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({error: 'user not found'});
        if (user && bcrypt.compareSync(req.body.password, user.hash)) {
            const { hash, ...userWithoutHash } = user.toObject();
            const token = jwt.sign({ sub: user.id }, "ABDKFIKELJAKJ@#@#JDAF9!@@#!@#$%^%&*(^&%$#@AKSDJFALS");
            console.log('ok', token);
            res.json(user);
        }
    });
})

// Create
router.post('/',
    function(req, res, next){
    console.log('create user');
        /*if (User.findOne({ username: req.body.username })) {
            throw 'Username "' + req.body.username + '" is already taken';
        }
*/
        User.findOne({})
            .sort({id: -1})
            .exec(function(err, user){
                if(err) {
                    res.status(500);
                    return res.json({success:false, message:err});
                }
                else {
                    res.locals.lastId = user?user.id:0;
                    next();
                }
            });
    },
    function(req, res, next){
        var newUser = new User(req.body);
        newUser.id = res.locals.lastId + 1;
        if (req.body.password) {
            newUser.hash = bcrypt.hashSync(req.body.password, 10);
        }
        newUser.save(function(err, user){
            if(err) {
                res.status(500);
                res.json({success:false, message:err});
            }
            else {
                res.json({success:true, data:user});
            }
        });
    }
);

// Update
router.put('/:id',
    function(req, res, next){
    console.log('putputputputputput');
        User.findOneAndUpdate({id:req.params.id}, req.body)
            .exec(function(err, user){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!user){
                    res.json({success:false, message:"company not found"});
                }
                else {
                    res.json({success:true});
                }
            });

        /*const user = await User.findById(id);

        // validate
        if (!user) throw 'User not found';
        if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
            throw 'Username "' + userParam.username + '" is already taken';
        }

        // hash password if it was entered
        if (userParam.password) {
            userParam.hash = bcrypt.hashSync(userParam.password, 10);
        }

        // copy userParam properties to user
        Object.assign(user, userParam);

        await user.save();*/
    }
);

// Destroy
router.delete('/:id',
    function(req, res, next){
        User.findOneAndRemove({id:req.params.id})
            .exec(function(err, user){
                if(err) {
                    res.status(500);
                    res.json({success:false, message:err});
                }
                else if(!user){
                    res.json({success:false, message:"company not found"});
                }
                else {
                    res.json({success:true});
                }
            });
    }
);

module.exports = router;
