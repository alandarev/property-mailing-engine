// So we develop a property finder
// There needs to be at least simple HTTP front-page listing latest properties
// So we can start with that, after creating that simple listing, focus on crawler to work
// And finally make the actual email functionality work :)
// Easy, right?

var jade = require('jade'),
    http = require('http'),
    Router = require('routes-router'),
    st = require('st');
    zoopla = require('./includes/zoopla');

var listingPage = jade.compileFile('templates/listing.jade');

var app = Router();
var server = http.createServer(app);

app.addRoute("/static/*", st({
  path: __dirname + "/static",
  url: "/static",
  index: false
}));

app.addRoute("/", function indexPage(request, response) {
  zoopla.getAll(function(err, data) {
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

  });
});

app.addRoute("/json", function jsonIndexPage(request, response) {
  zoopla.getAll(function(err, data)  {
    if(err) console.log("ERROR: " + err);
    response.end(JSON.stringify(data, null, '\t'));
  });
});


server.listen(8010);
