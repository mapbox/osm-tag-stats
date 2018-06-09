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
    bbox = cleanArguments.argv.bbox,
    tmpFd;

if ((!geojson && !count) || !mbtilesPath || argv.help) {
    help();
}

tileReduce({
    bbox: bbox,
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
.on('start', () => {
    if (tmpGeojson) {
        tmpFd = fs.openSync(tmpGeojson, 'w');
    }
})
.on('reduce', () => {})
.on('end', () => {
    if (geojson) {
        gsm(tmpGeojson, geojson, function () {
            fs.closeSync(tmpFd);
            fs.unlinkSync(tmpGeojson);
            fs.rmdirSync(tmpDir);
        });
    }
});
