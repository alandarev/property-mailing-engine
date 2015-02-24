
GeometryBounds = function(bounds) {
  this.bounds = [];
  for(var i in bounds)  {
    console.log(JSON.stringify(bounds[i], null, 2));
  }

}

GeometryBounds.prototype.isContained = function isContained(dot)  {

}

exports.GeometryBounds = GeometryBounds;
