function normaliseGeometries(geometries)  {
  var figures = [];
  for(var i in geometries)  {
    var paths = [];
    if(geometries[i]['figure'] == 'rectangle')  {
      var ne = geometries[i]['ne'];
      var sw = geometries[i]['sw'];
      paths.push(ne);
      paths.push([ne[0], sw[1]]);
      paths.push(sw);
      paths.push([sw[0], ne[1]]);
    }
    else  if(geometries[i]['figure'] == 'polygon')  {
      paths = geometries[i]['paths'][0];
    }
    figures.push(paths);

  }

  for(var i in figures) {
    for(var pathId in figures[i]) {
      var lat = figures[i][pathId][0];
      var lng = figures[i][pathId][1];
      figures[i][pathId] = { lat: lat, lng: lng };
    }
  }
  return figures;
}


exports.normaliseGeometries = normaliseGeometries;
