var map;
var geocoder;

function initialize() {
  geocoder = new google.maps.Geocoder();

  var address = document.getElementById('input-location').value;
  console.log(address);
  geocoder.geocode({'address': address}, function(results, status)  {
    if(status == google.maps.GeocoderStatus.OK) {
      var mapOptions = {
        center: results[0].geometry.location,
        zoom: 9
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    }
    else  {
      console.log("Geolocator error: " + status);
    }
  });
}


google.maps.event.addDomListener(window, 'load', initialize);
