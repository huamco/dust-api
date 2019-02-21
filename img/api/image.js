const express  = require('express');
const router = express.Router({mergeParams: true});

router.get('/', function(req, res, next){
    console.log("get image!!");
});
//upload
router.post('/', function(req, res){
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.image;
    //console.log('sampleFile::::::::', sampleFile);
    //console.log('__dirname::::::::', __dirname);
    // Use the mv() method to place the file somewhere on your server
    //sampleFile.mv('C:/prj/project_src/hac-api/img/'+req.files[0].name, function(err) {
    sampleFile.mv(__dirname + '/img/' +sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

module.exports = router;
