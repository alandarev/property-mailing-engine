var zoopla = require('./zoopla'),
    DB = require('./mongo').DataProvider;

var dbUrl = 'mongodb://localhost/properties-node';

function run(db)  {
  zoopla.getAll(function(err, data) {
    if(err) return console.error("Zoopla Error: " + err);
    console.log("Got everything");

    db.save(data);
  });
}

exports.run = run;
