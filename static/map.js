var map;
var geocoder;
var drawingManager;
var infoWindow;

function initialize() {
  drawingManager = new google.maps.drawing.DrawingManager();
  infoWindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();

  var address = document.getElementById('input-location').value;
  geocoder.geocode({'address': address}, function(results, status)  {
    if(status == google.maps.GeocoderStatus.OK) {
      var mapOptions = {
        center: results[0].geometry.location,
        zoom: 12
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

      // Setup Drawing tools
      drawingManager.setOptions({
        //drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions:  {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.RECTANGLE
          ]
        },
        polygonOptions: {
          draggable:  true,
          editable: true,
        },
        rectangleOptions: {
          draggable:  true,
          editable: true,
        }

      });
      drawingManager.setMap(map);
      google.maps.event.addListener(drawingManager, 'overlaycomplete', drawingComplete);
    }
    else  {
      console.log("Geolocator error: " + status);
    }
  });
}

function drawingComplete(event)  {
  var figure = event.overlay;
  var paths = [];
  console.log("finished drawing: " + event.type);
  if(event.type == "rectangle") {
    var path = [];
    console.log("rect found");
    var bounds = figure.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    path.push(ne);
    path.push(new google.maps.LatLng(ne.lat(), sw.lng()));
    path.push(sw);
    path.push(new google.maps.LatLng(sw.lat(), ne.lng()));
    paths.push(path);
  }
  else if(event.type == "polygon")  {
    var marray = figure.getPaths();
    for(var i=0; i<marray.getLength(); i++) {
      path = [];
      var mvcpath = marray.getAt(i);
      for(var y=0; y<mvcpath.getLength(); y++)  {
        path.push(mvcpath.getAt(y));
      }
      console.log(path);
      paths.push(path);
    }
  }
  for(var i=0; i<paths.length; i++)  {
    //console.log(paths[i]);
  }
}


google.maps.event.addDomListener(window, 'load', initialize);
