var zoopla = require('./zoopla'),
    geometry = require('node-geometry'),
    gmaps = require('./gmaps'),
    DB = require('./mongo').DataProvider;

var dbUrl = 'mongodb://localhost/properties-node';

function run(config, db)  {
  zoopla.getFilter(function locFilter(err, data)  {
    if(err) return console.error("Zoopla Error: " + err);
    var normalisedGeo = gmaps.normaliseGeometries(config['geometries']);
    var gb = new geometry.GeometryBounds(normalisedGeo);
    var checkGeometry = normalisedGeo.length > 0;
    console.log("gb: " + gb);
    for(var i=data.length-1; i >= 0; i--)  {
      var point = { 'lat': data[i]['latitude'], 'lng': data[i]['longitude'] };
      if(checkGeometry && !gb.contains(point)) {
        data.splice(i, 1);
      }
    }
    db.save(data);
  }, config);

});
}

exports.run = run;
