#!/usr/bin/env node
'use strict';

var fs = require('fs');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var count = false,
    geojson = false,
    users = false,
    dates = false,
    mbtilesPath = false,
    tagFilter = false;
var OSMID = [];

init();

if ((!geojson && !count) || !mbtilesPath || argv.help) {
    console.log('Queries OSM QA tiles to generate a geojson after applying the following filters.');
    console.log('index.js --geojson --mbtiles=<path-to-mbtiles>[options] OR index.js --count --mbtiles=<path-to-mbtiles>[options]');
    console.log('[options]:');
    console.log('  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>". If you pass "mapbox", it queries mbtiles for all edits from the Mapbox Data Team.');
    console.log('  --filter="<Path to file containing tag filters>" Filters are written as specified in the Mapbox GL JS Filter Spec(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter)');
    console.log('  --mbtiles="<path-to-mbtiles-from-the-current-directory>"');
    console.log('  --dates="startDate[endDate]" Get geojson for user edits in a range of dates. If endDate is not specified, it computes all edits in startDate + 24 hours. (All dates are considered in the UTC)');
    console.log('  --count returns total count of filtered features');
    console.log('  --help  Print this report');
    console.log(' The --mbtiles argument is REQUIRED. So is at least ONE of the --geojson or --count arguments');
    process.exit(0);
}

tileReduce({
    zoom: 12,
    map: path.join(__dirname, 'map.js'),
    sources: [{name: 'osm', mbtiles: path.join(__dirname, mbtilesPath)}],
    mapOptions: {
        'count': count,
        'geojson': geojson,
        'dates': dates,
        'users': users,
        'tagFilter': tagFilter
    }
})
.on('reduce', function (id) {
    if (argv.count) {
        OSMID = OSMID.concat(id);
    }
})
.on('end', function () {
    if (argv.count) {
        var uniqueIDs = _.uniq(OSMID);
        console.log('Features total: %d', uniqueIDs.length);
    }
});

function init() {
    if (argv.geojson) {
        geojson = (path.extname(argv.geojson) === '.geojson') ? argv.geojson : argv.geojson.concat('.geojson');
        if (fs.existsSync(geojson)) {
            fs.unlinkSync(geojson);
        }
    }
    count = Boolean(argv.count);

    //filter
    if (argv.filter && fs.existsSync(argv.filter)) {
        tagFilter = JSON.parse(fs.readFileSync(argv.filter));
    } else {
        tagFilter = false;
    }

    //dates
    if (argv.dates) {
        dates = argv.date.split(',');
        trimStrings(dates);
    }

    //users
    if (argv.users && argv.users.toLowerCase() === 'mapbox') {
        users = ['ruthmaben', 'jinalfoflia', 'saikabhi', 'Jothirnadh', 'aarthykc', 'pratikyadav', 'Chetan_Gowda', 'oini', 'ramyaragupathy', 'nikhilprabhakar', 'srividya_c', 'PlaneMad', 'manings', 'nammala', 'poornibadrinath', 'geohacker', 'shvrm', 'bkowshik', 'sanjayb', 'Arunasank', 'Luis36995', 'samely', 'ediyes', 'RichRico', 'andygol', 'karitotp', 'ridixcr', 'calfarome', 'dannykath', 'Rub21', 'Aaron Lidman', 'abel801', 'lxbarth'];
    } else if (argv.users) {
        users = argv.users.split(',');
        trimStrings(users);
    } else {
        users = false;
    }

    //path
    mbtilesPath = checkMBTiles(argv.mbtiles);

    function trimStrings(strings) {
        strings.forEach(function (string) {
            string.trim();
        });
    }

    function checkMBTiles(mbtilesPath) {
        if (!mbtilesPath || (path.extname(mbtilesPath) !== '.mbtiles')) {
            return false;
        } else {
            return (fs.existsSync(mbtilesPath)) ? mbtilesPath : false;
        }
    }
}
