// So we develop a property finder
// There needs to be at least simple HTTP front-page listing latest properties
// So we can start with that, after creating that simple listing, focus on crawler to work
// And finally make the actual email functionality work :)
// Easy, right?

var jade = require('jade'),
    http = require('http');

var listingPage = jade.compileFile('templates/listing.jade');


var server = http.createServer();

server.on('request', function webListener(request, response)  {
  console.log(request.url);
  response.end(listingPage({}));
});

server.listen(8010);
