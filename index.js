'use strict';

var fs = require('fs');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var count, geojson, users, dates, mbtiles;
var OSMID = [];

init();

if ((!geojson && !count) || !mbtiles || argv.help) {
    console.log('Queries OSM QA tiles to generate a geojson after applying the following filters.');
    console.log('index.js --geojson --mbtiles=<path-to-mbtiles>[options] OR index.js --count --mbtiles=<path-to-mbtiles>[options]');
    console.log('[options]:');
    console.log('  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>" Defaults to the Mapbox team if nothing is specified');
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
    sources: [{name: 'osm', mbtiles: path.join(__dirname, '../latest.planet.mbtiles')}],
    mapOptions: {
        'count': count,
        'geojson': geojson,
        'dates': dates,
        'users': users
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
    count = Boolean(argv.count);
    geojson = Boolean(argv.geojson);
    dates = false;

    if (argv.dates) {
        dates = argv.date.split(',');
        trimStrings(dates);
    }

    if (argv.users.toLowerCase() === 'mapbox') {
        users = ['ruthmaben', 'jinalfoflia', 'saikabhi', 'Jothirnadh', 'aarthykc', 'pratikyadav', 'Chetan_Gowda', 'oini', 'ramyaragupathy', 'nikhilprabhakar', 'srividya_c', 'PlaneMad', 'manings', 'nammala', 'poornibadrinath', 'geohacker', 'shvrm', 'bkowshik', 'sanjayb', 'Arunasank'];
    } else if (argv.users) {
        users = argv.users.split(',');
        trimStrings(users);
    }

    mbtiles = checkMBTiles(argv.mbtiles);

    function trimStrings(strings) {
        strings.forEach(function (string) {
            string.trim();
        });
    }

    function checkMBTiles(mbtiles) {
      //console.log("mbtils length ",mbtiles.indexOf(".mbtiles") == (mbtiles.length - ".mbtiles".length));
        if (!mbtiles || !(mbtiles.lastIndexOf('.mbtiles') === (mbtiles.length - '.mbtiles'.length))) {
            return false;
        } else {
            fs.access(mbtiles, fs.F_OK | fs.R_OK, function (err) {
                if (err) {
                    console.log(err);
                    return false;
                }
            });
            return true;
        }

    }
}
