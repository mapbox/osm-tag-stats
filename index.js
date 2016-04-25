'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');
var numFeatures = 0;
var _ =require('underscore');
var OSMID= [];
tileReduce({
  zoom: 12,
  map: path.join(__dirname, 'map.js'),
  sources: [{name: 'osm', mbtiles: path.join(__dirname, '../latest.planet.mbtiles')}]
})
.on('reduce', function(id) {
OSMID = OSMID.concat(id);
})
.on('end', function() {
  var uniqueIDs = _.uniq(OSMID);
  console.log('Features total: %d', uniqueIDs.length);
});
