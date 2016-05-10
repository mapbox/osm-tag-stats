#!/usr/bin/env node
'use strict';

var help = require('./util/help.js');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var gsm = require('geojson-stream-merge');
var fs = require('fs');

var tmpDir = 'tmp-osm-tag-stats/', tmpGeojson;
var cleanArguments = require('./util/cleanArguments')(argv, tmpDir, tmpGeojson);

var count = cleanArguments.argv.count,
    geojson = cleanArguments.argv.geojson,
    users = cleanArguments.argv.users,
    dates = cleanArguments.argv.dates,
    mbtilesPath = cleanArguments.argv.mbtiles,
    tmpGeojson = cleanArguments.tmpGeojson,
    tagFilter = cleanArguments.argv.filter;
var OSMID = [];

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
        gsm(tmpGeojson, geojson);
        fs.unlinkSync(tmpGeojson);
        fs.rmdirSync(tmpDir);
    }
});
