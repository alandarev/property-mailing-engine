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
          fillOpacity: 0.35,
        },
        rectangleOptions: {
          draggable:  true,
          editable: true,
          fillOpacity: 0.35,
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

var geometries = [];


function drawingComplete(event)  {
  var figure = event.overlay;
  geometries.push(figure);
  google.maps.event.addListener(figure, 'mouseover', function() {
    figure.setOptions({
      fillOpacity: 0.55
    });
  });
  google.maps.event.addListener(figure, 'mouseout', function()  {
    figure.setOptions({
      fillOpacity: 0.35
    });
  });
  google.maps.event.addListener(figure, 'rightclick', function()  {
    figure.setMap(null);
    var index = geometries.indexOf(figure);
    if(index >= 0)  {
      geometries.splice(index, 1);
    }
  });
}

function saveGeometries() {
  for(var index in geometries) {
    var data = {};
    var geometry = geometries[index];
    console.log("geom: " + geometry);
    if(geometry instanceof google.maps.Rectangle) {
      console.log("saving rectangle");
      var bounds = geometry.getBounds();
      data = {
        'figure': "rectangle",
        'ne': bounds.getNorthEast(),
        'sw': bounds.getSouthWest()
      };
      console.log(data);
      console.log(JSON.stringify(data, null, '  '));
    }
    else if(geometry instanceof google.maps.Polygon)  {
      console.log("saving polygon");
      data['figure'] = 'polygon';
      var paths = [];
      var marray = geometry.getPaths();
      for(var i=0; i<marray.length; i++)  {
        path = [];
        var mvcpath = marray.getAt(i);
        for(var y=0; y<mvcpath.getLength(); y++)  {
          path.push(mvcpath.getAt(y));
        }
        paths.push(path);
      }
      data['paths'] = paths;
      console.log(data);
      console.log(JSON.stringify(data, null, '  '));
    }

  }
}

function to_remove_abc()  {
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

function readPolygons() {
  //map.data.GeometryC
}


google.maps.event.addDomListener(window, 'load', initialize);
