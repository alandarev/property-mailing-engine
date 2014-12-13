var zoopla = require('./zoopla'),
    DB = require('./mongo').DataProvider;

var dbUrl = 'mongodb://localhost/properties-node';
var db = new DB(dbUrl, function(err)  {
  if(err) return console.error("DB Error: " + err);
  zoopla.getAll(function(err, data) {
    if(err) return console.error("Zoopla Error: " + err);
    console.log("Got everything");

    db.save(data);
  });
});

