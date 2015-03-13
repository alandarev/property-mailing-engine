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
      loadGeometries();

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
  var savedGeometries = [];
  for(var index in geometries) {
    var data = {};
    var geometry = geometries[index];
    if(geometry instanceof google.maps.Rectangle) {
      var bounds = geometry.getBounds();
      data = {
        'figure': "rectangle",
        'ne': [bounds.getNorthEast().lat(), bounds.getNorthEast().lng()],
        'sw': [bounds.getSouthWest().lat(), bounds.getSouthWest().lng()]
      };
    }
    else if(geometry instanceof google.maps.Polygon)  {
      data['figure'] = 'polygon';
      var paths = [];
      var marray = geometry.getPaths();
      for(var i=0; i<marray.length; i++)  {
        path = [];
        var mvcpath = marray.getAt(i);
        for(var y=0; y<mvcpath.getLength(); y++)  {
          path.push(
              [mvcpath.getAt(y).lat(),
              mvcpath.getAt(y).lng()]);
        }
        paths.push(path);
      }
      data['paths'] = paths;
    }
    else  {
      data = { 'figure': "Unknown" };
    }
    savedGeometries.push(data);
  }
  return savedGeometries;
}

function loadGeometries() {
  var savedGeometries = JSON.parse(document.getElementById('input-geometries').value);
  for(var i=savedGeometries.length-1; i>=0; i--)  {
    var geom = savedGeometries[i];
    if(geom.figure == 'rectangle')  {
      var sw = new google.maps.LatLng(geom.sw[0], geom.sw[1]);
      var ne = new google.maps.LatLng(geom.ne[0], geom.ne[1]);
      var bounds = new google.maps.LatLngBounds(sw, ne);
      var rectangle = new google.maps.Rectangle({
        map: map,
        bounds: bounds,
        draggable:  true,
        editable: true,
        fillOpacity: 0.35,
      });
      var event = { overlay: rectangle };
      drawingComplete(event);
    }
    else if(geom.figure == 'polygon') {
      for(var iter1 in geom.paths)  {
        for(var iter2 in geom.paths[iter1]) {
          geom.paths[iter1][iter2] = new google.maps.LatLng(
              geom.paths[iter1][iter2][0],
              geom.paths[iter1][iter2][1]);
        }
      }
      var polygon = new google.maps.Polygon({
        paths: geom.paths,
        map: map,
        draggable: true,
        editable: true,
        fillOpacity: 0.35,
      });
      var event = { overlay: polygon };
      drawingComplete(event);
    }
    else  {
      savedGeometries.splice(i, 1);
    }
  }
}

function OnPostData() {
  var field = document.getElementById('input-geometries');
  var toSave = saveGeometries();
  field.value = JSON.stringify(toSave);
}

function readPolygons() {
  //map.data.GeometryC
}

window.onload = function initJavascript() {
  var form = document.getElementById('form-settings');
  form.onsubmit = OnPostData;
}

google.maps.event.addDomListener(window, 'load', initialize);
