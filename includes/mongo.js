var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://localhost/properties-node';

DataProvider = function(url, callback){
  var dataprovider = this;
  MongoClient.connect(url, function(err, db)  {
    if(err) return callback(err);
    dataprovider.db = db;
    callback();
  });
};

DataProvider.prototype.close = function()  {
  if(this.db) {
    this.db.close();
  }
};

DataProvider.prototype.getCollection = function(callback) {
  this.db.collection('properties', function(err, col) {
    if(err) return callback(err);
    callback(null, col);
  });
}

DataProvider.prototype.save = function(objects, callback) {
  if(typeof(objects.length) == "undefined") {
    objects = [objects];
  }
  for(var i=0; i<objects.length; i++) {
    if(objects[i].listing_id) {
      objects[i]._id = "zoopla_" + objects[i].listing_id;
    }
  }
  this.getCollection(function(err, collection)  {
    if(err) return console.error("Error: " + err);
    for(var i=0; i<objects.length; i++) {
      collection.save(objects[i], null, function(err, result)  {
        if(err) return console.error("Error: " + err);
      });
    }
  });
  //console.log(JSON.stringify(objects, null, '\t'));

};

//var data = new DataProvider(dbUrl, function(err)  {
  //console.log("err? ");
  //console.log(err);
  //console.log(data.db);
  //data.close();
//});

exports.DataProvider = DataProvider;
