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
  console.log("finished drawing: " + event.type);
}


google.maps.event.addDomListener(window, 'load', initialize);
