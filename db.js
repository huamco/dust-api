var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    //createCapped(db22);
    var db = client.db('hac');

    db.collection('customers').insertOne({a:2}, function (findErr, result) {
        if (findErr) throw findErr;
        console.log(result);
        client.close();
    });
});


function abc(db){
    db.collection("users").insertOne({a:2});
}


var createCapped = function(dbx) {
    dbx.createCollection("myCollection", { "capped": true, "size": 100000, "max": 5000},
        function(err, results) {
            console.log("Collection created.");
        });
};
