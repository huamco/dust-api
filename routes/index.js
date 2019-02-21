var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const { userSchema } = require('../models/user.js');
/*const Schema = mongoose.Schema;
let userSchema = new Schema({ name : String, type : String});
db.on('error', console.error.bind(console,'connection error : '));*/

/*db.once('open', function (){
  console.log('mongoose connected');
});*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('mongoose/insert',function (req, res) {
  /*req.param('name');
  req.param('');

  var user = mongoose.model('User',userSchema);
  user.save({
      name: req.param('name')
  });
  user.find().getElementsByName('').exec(function (err, users){
    console.log(users);
  });
   userSchema.methods.findById(1);*/

});





module.exports = router;
