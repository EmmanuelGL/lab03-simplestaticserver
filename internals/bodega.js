var config = require("../config/config");
var MongoClient = require('mongodb').MongoClient;
 
var stringConnection = config.dbStringConnection;
console.log(`> BD: ${stringConnection}`);
//exportando ES6
exports.saveItem = function(item, cb){
    //connectando a la base de datos 
    MongoClient.connect(stringConnection, function(err,db){
        if(err){
            cb(err, null);
            return;
        }
        //obteniendola coleccion
        var itemsCollection = db.collection('item');
        //Inserta el Articulo
        itemsCollection.insertOne(item, function(err,result){
            cb(err,result);
        })
    })
}