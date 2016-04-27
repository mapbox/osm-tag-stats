'use strict';

var fs = require('fs');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var readline = require('readline');
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
    console.log('  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>" Defaults to the Mapbox team if nothing is specified');
    console.log('  --filter="<Path to file containing tag filters>" Filters are written as specified in the Mapbox GL JS Filter Spec(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter)');
    console.log('  --mbtiles="<path-to-mbtiles-from-the-current-directory>"');
    console.log('  --dates="startDate[date2, date3, endDate]" Get geojson for user edits in a range of dates');
    console.log('  --count returns total count of features added by a user');
    console.log('  --help  Print this report');
    console.log(' At least one of the --geojson or --count options must be present');
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
   if(argv.geojson) {
       geojson = (path.extname(argv.geojson) === '.geojson') ? argv.geojson : argv.geojson.concat('.geojson');
   }
//overwrite existing files?
/*
     var overwrite = false;
     while (!overwrite && argv.geojson && fs.existsSync(argv.geojson)) {
        var rl = readline.createInterface(process.stdin, process.stdout);
        geojson = argv.geojson = rl.question('File exists, overwrite? (y/n)', function (answer) {
            if (answer === 'y') {
                overwrite = true;
                return argv.geojson;
            } else {
                var rl = readline.createInterface(process.stdin, process.stdout);
                rl.question('Enter new file name', function (answer) {
                    return (path.extname(answer) === '.geojson') ? answer : answer.concat('.geojson');
                });
            }
        });
    }*/

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
        users = ['ruthmaben', 'jinalfoflia', 'saikabhi', 'Jothirnadh', 'aarthykc', 'pratikyadav', 'Chetan_Gowda', 'oini', 'ramyaragupathy', 'nikhilprabhakar', 'srividya_c', 'PlaneMad', 'manings', 'nammala', 'poornibadrinath', 'geohacker', 'shvrm', 'bkowshik', 'sanjayb', 'Arunasank'];
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
