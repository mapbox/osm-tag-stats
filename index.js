'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var count = (argv.count) ? true : false;
var geojson = (argv.geojson) ? true : false;
var users = (argv.users) ? argv.users.split(",") : ["ruthmaben","jinalfoflia","saikabhi","Jothirnadh","aarthykc","pratikyadav","Chetan_Gowda","oini","ramyaragupathy","nikhilprabhakar","srividya_c","PlaneMad","manings","nammala","poornibadrinath","geohacker","shvrm","bkowshik","sanjayb","Arunasank"];
var dates = (argv.date) ? argv.date.split(",") : false;

var OSMID= [];

tileReduce({
  zoom: 12,
  map: path.join(__dirname, 'map.js'),
  sources: [{name: 'osm', mbtiles: path.join(__dirname, '../latest.planet.mbtiles')}],
  mapOptions: { 
    "count":count,
    "geojson":geojson,
    "dates":dates,
    "users":users
  }
})
.on('reduce', function(id) {
OSMID = OSMID.concat(id);
})
.on('end', function() {
  var uniqueIDs = _.uniq(OSMID);
  console.log('Features total: %d', uniqueIDs.length);
});
