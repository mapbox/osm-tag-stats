#!/usr/bin/env node
'use strict';

var help = require('./util/help.js');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var cleanArguments = require('./util/cleanArguments')(argv);
var gsm = require('geojson-stream-merge');
var fs = require('fs');
var count = cleanArguments.count,
    geojson = cleanArguments.geojson,
    users = cleanArguments.users,
    dates = cleanArguments.dates,
    mbtilesPath = cleanArguments.mbtiles,
    tmpGeojson = cleanArguments.tmpGeojson,
    tagFilter = cleanArguments.filter;
var OSMID = [];
console.log(tmpGeojson)
if ((!geojson && !count) || !mbtilesPath || argv.help) {
    help();
}

tileReduce({
    zoom: 12,
    map: path.join(__dirname, 'map.js'),
    sources: [{name: 'osm', mbtiles: mbtilesPath}],
    mapOptions: {
        'count': count,
        'tmpGeojson': tmpGeojson,
        'dates': dates,
        'users': users,
        'tagFilter': tagFilter
    }
})
.on('reduce', function (id) {
    if (count) {
        OSMID = OSMID.concat(id);
    }
})
.on('end', function () {
    if (count) {
        var uniqueIDs = _.uniq(OSMID);
        console.log('Features total: %d', uniqueIDs.length);
    }
    if (geojson) {
//        gsm(tmpGeojson, geojson);
    }
});
