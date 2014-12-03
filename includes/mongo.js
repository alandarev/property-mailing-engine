var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://localhost/properties-node';

DataProvider = function(url, callback){
  var dataprovider = this;
  MongoClient.connect(url, function(err, db)  {
    if(err) callback(err);
    dataprovider.db = db;
    callback();
  });
};

DataProvider.prototype.close = function()  {
  this.db.close();
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

};

var data = new DataProvider(dbUrl, function(err)  {
  console.log("err? ");
  console.log(err);
  console.log(data.db);
  data.close();
});

exports.DataProvider = DataProvider;
