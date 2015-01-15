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
    st = require('st');
    zoopla = require('./includes/zoopla');

var listingPage = jade.compileFile('templates/listing.jade');
var configTemplate = jade.compileFile('templates/config.jade');

var app = Router();
var server = http.createServer(app);
var DB = require('./includes/mongo').DataProvider;

// Initialize connection to the DB
var dbUrl = 'mongodb://localhost/properties-node';
var db = new DB(dbUrl, function(err)  {
  if(err) return console.error("DB Error: " + err);
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
      db.saveConfig(postData, function(err) {
        if(err) console.log("Error: " + err);
      });
    });
  }
  response.end(configTemplate({config: null}));
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

  else  {
    zoopla.getAll(printResults);
  }
});

app.addRoute("/json", function jsonIndexPage(request, response) {
  zoopla.getAll(function(err, data)  {
    if(err) console.log("ERROR: " + err);
    response.end(JSON.stringify(data, null, '\t'));
  });
});


server.listen(8010);
