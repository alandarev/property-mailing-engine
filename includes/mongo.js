var MongoClient = require('mongodb').MongoClient;


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
};

DataProvider.prototype.onlyNew = function(objects, callback)  {
  if(typeof(objects.length) == "undefined") {
    objects = [objects];
  }
  var ids = [];
  for(var i=0; i<objects.length; i++) {
    if(objects[i].listing_id) {
      ids.push('zoopla_' + objects[i].listing_id);
    }
  }
  this.getCollection(function(err, collection)  {
    if(err) return callback(err);
    collection.find({
      '_id':  {
        '$in':  ids
      }
    }, { '_id': true }, null, function(err, cursor) {
      cursor.each(function(err, doc)  {
        if(err) return callback(err);
        if(doc != null) {
          var foundId = doc['_id'];
          ids.splice(ids.indexOf(foundId), 1);
        }
        else  {
          // Finished
          for(var i=objects.length-1; i >= 0; i--)  {
            if(ids.indexOf('zoopla_' + objects[i].listing_id))  {
              objects.splice(i, 1);
            }
          }
          return callback(null, objects);
        }
      });
    });
  });

};

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

DataProvider.prototype.saveConfig = function(config, callback)  {
  config['_id'] = 'config';
  this.db.collection('config', function(err, collection) {
    if(err) return callback(err);
    collection.save(config, null, function(err, results)  {
      if(err) {
        callback(err);
      }
      callback(null);
    });
  });
};

DataProvider.prototype.getConfig = function(callback) {
  this.db.collection('config', function(err, col) {
    if(err) return callback(err);
    col.findOne({'_id': 'config'}, function(err, doc) {
      if(err) return callback(err);
      return callback(null, doc);
    });
  });
};

//var data = new DataProvider(dbUrl, function(err)  {
  //console.log("err? ");
  //console.log(err);
  //console.log(data.db);
  //data.close();
//});

exports.DataProvider = DataProvider;
