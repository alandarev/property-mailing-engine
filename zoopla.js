var parseXml = require('xml2js').parseString;
var request = require('request');
var util = require('util');

//http://api.zoopla.co.uk/api/v1/property_listings?api_key=kgrruzj6vffrpscxp88yzy78&country=United%20Kingdom&listing_status=rent&lat_min=-90&lat_max=90&lon_min=-180&lon_max=180&order_by=age

request({
    url:  'http://api.zoopla.co.uk/api/v1/property_listings?api_key=kgrruzj6vffrpscxp88yzy78&country=United%20Kingdom&listing_status=rent&lat_min=-90&lat_max=90&lon_min=-180&lon_max=180&order_by=age',
    json: true
  }, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parseXml(body, function(err, result)  {
      //console.dir(result);
      console.log(util.inspect(result, false, null))
    });
  }
});
