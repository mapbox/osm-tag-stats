'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');
var numFeatures = 0;
tileReduce({
  zoom: 12,
  map: path.join(__dirname, 'map.js'),
  sources: [{name: 'osm', mbtiles: path.join(__dirname, '../../../latest.planet.mbtiles')}]
})
.on('reduce', function(num) {
  numFeatures += num;
})
.on('end', function() {
  console.log('Features total: %d', numFeatures);
});
