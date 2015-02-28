// So we develop a property finder
// There needs to be at least simple HTTP front-page listing latest properties
// So we can start with that, after creating that simple listing, focus on crawler to work
// And finally make the actual email functionality work :)
// Easy, right?

var jade = require('jade'),
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    Router = require('routes-router'),
    st = require('st'),
    geometry = require('node-geometry'),
    CronJob = require('cron').CronJob;

var zoopla = require('./includes/zoopla'),
    gmaps = require('./includes/gmaps'),
    DB = require('./includes/mongo').DataProvider,
    zcrawler = require('./includes/zoopla_crawler');

var listingPage = jade.compileFile('templates/listing.jade');
var configTemplate = jade.compileFile('templates/config.jade');

var app = Router();
var server = http.createServer(app);

// Initialize connection to the DB
var dbUrl = 'mongodb://localhost/properties-node';
var db = new DB(dbUrl, function(err)  {
  if(err) return console.error("DB Error: " + err);

  new CronJob('30 * * * * *', function mainCron() {
    console.log("tick");
    zcrawler.run(db);
  }, null, true, null);
});


app.addRoute("/static/*", st({
  path: __dirname + "/static",
  url: "/static",
  index: false
}));

app.addRoute("/config", function configPage(request, response)  {
  if(request.method == 'POST')  {
    var body = '';
    request.on('data', function(data) {
      body += data;
      if (body.length > 1e6)  {
        request.connection.destroy();
      }
    });
    request.on('end', function()  {
      var postData = qs.parse(body);

      postData.geometries = JSON.parse(postData.geometries);
      console.log(JSON.stringify(postData, null, '\t'));

      db.saveConfig(postData, function(err) {
        if(err) console.log("Error: " + err);
        response.writeHead(302, {Location: '/'});
        response.end();
      });
    });
  }
  else  {
    db.getConfig(function(err, config)  {
      if(err) {
        response.end("500 DB Error");
        return console.log("Error: " + err);
      }
      response.end(configTemplate({config: config}));
    });
  }
});

app.addRoute("/", function indexPage(request, response) {
  var queryData = url.parse(request.url, true).query;

  function printResults(err, data)  {
    if(err) {
      console.log("ERROR: " + err);
      response.end("Zoopla API error");
      return;
    }
    var maxLength = 400;
    for (i=0; i< data.length; i++)  {
      if(String(data[i]['description']).length > maxLength) {
        data[i]['description'] = String(data[i]['description']).substring(0, maxLength) + "...";
      }
    }
    response.end(listingPage({props: data}));
  }

  if(queryData.area) {
    var area = queryData.area;
    zoopla.getLocation(printResults, area, queryData.radius);
  }
  else {
    db.getConfig(function(err, config) {
      if(err) {
        console.error("Error: " + err);
        return zoopla.getAll(printResults);
      }
      zoopla.getFilter(function locFilter(err, data)  {
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
        printResults(err, data);
      }, config);
    });
  }

});

app.addRoute("/json", function jsonIndexPage(request, response) {
  zoopla.getAll(function(err, data)  {
    if(err) console.log("ERROR: " + err);
    response.end(JSON.stringify(data, null, '\t'));
  });
});


server.listen(8010);
