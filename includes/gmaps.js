function normaliseGeometries(geometries)  {
  var figures = [];
  for(var i in geometries)  {
    var paths = [];
    if(geometries[i]['figure'] == 'rectangle')  {
      var ne = geometries[i]['ne'];
      var sw = geometries[i]['sw'];
      paths.push(ne);
      paths.push({k: ne['k'], B: sw['B']});
      paths.push(sw);
      paths.push({k: sw['k'], B: sw['B']});
    }
    else  if(geometries[i]['figure'] == 'polygon')  {
      paths = geometries[i]['paths'][0];
    }
    //Convert k, B to latitude, longitude
    for(var y in paths) {
      paths[y]['lat'] = paths[y]['k'];
      paths[y]['lng'] = paths[y]['B'];
      delete paths[y]['k'];
      delete paths[y]['B'];
    }
    figures.push(paths);

  }
  return figures;
}


exports.normaliseGeometries = normaliseGeometries;
