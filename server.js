// So we develop a property finder
// There needs to be at least simple HTTP front-page listing latest properties
// So we can start with that, after creating that simple listing, focus on crawler to work
// And finally make the actual email functionality work :)
// Easy, right?

var jade = require('jade'),
    http = require('http'),
    Router = require('routes-router'),
    st = require('st');
    zoopla = require('./zoopla');

var listingPage = jade.compileFile('templates/listing.jade');

var app = Router();
var server = http.createServer(app);

app.addRoute("/static/*", st({
  path: __dirname + "/static",
  url: "/static",
  index: false
}));

app.addRoute("/", function indexPage(request, response) {
  response.end(listingPage({}));
});

app.addRoute("/json", function jsonIndexPage(request, response) {
  zoopla.getAll(function(data)  {
    response.end(JSON.stringify(data, null, '\t'));
  });
});

server.listen(8010);
