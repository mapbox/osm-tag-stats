#!/usr/bin/env node
'use strict';

var help = require('./util/help.js');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var gsm = require('geojson-stream-merge');
var fs = require('fs');

var tmpDir = 'tmp-osm-tag-stats/';
var cleanArguments = require('./util/cleanArguments')(argv, tmpDir);

var count = cleanArguments.argv.count,
    geojson = cleanArguments.argv.geojson,
    users = cleanArguments.argv.users,
    dates = cleanArguments.argv.dates,
    mbtilesPath = cleanArguments.argv.mbtiles,
    tmpGeojson = cleanArguments.tmpGeojson,
    tagFilter = cleanArguments.argv.filter,
    osmID = new Set(),
    bboxVal = argv.bbox.split(","),
    tmpFd;

if ((!geojson && !count) || !mbtilesPath || argv.help) {
    help();
}

/**
 A tile reduce script to filter OSM features and export them to GeoJSON.
 */
tileReduce({
    bbox: bboxVal,
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
.on('start', function () {
    if (tmpGeojson) {
        tmpFd = fs.openSync(tmpGeojson, 'w');
    }
})
.on('reduce', function (id) {
    if (count && id) {
        id.forEach(function(idElement) {
            osmID.add(idElement);
        });
    }
})
.on('end', function () {
    if (count) {
        console.log('Features total: %d', osmID.size);
    }
    if (geojson) {
        gsm(tmpGeojson, geojson, function () {
            fs.closeSync(tmpFd);
            fs.unlinkSync(tmpGeojson);
            fs.rmdirSync(tmpDir);
        });
    }
});
