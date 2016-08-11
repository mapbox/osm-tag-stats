'use strict';
var path = require('path');
var fs = require('fs');
var mapboxDataTeam = require('mapbox-data-team');

function cleanArguments(argv, tmpFilesDir) {
    var mapboxUsernames = mapboxDataTeam.getUsernames();

    //geojson
    if (argv.geojson) {
        if (!fs.existsSync(tmpFilesDir)) {
            fs.mkdirSync(tmpFilesDir);
        }

        argv.geojson = (path.extname(argv.geojson) === '.geojson') ? argv.geojson : String(argv.geojson).concat('.geojson');
        var tmpGeojson = tmpFilesDir + argv.geojson;

        if (fs.existsSync(argv.geojson)) {
            fs.unlinkSync(argv.geojson);
        }
        if (fs.existsSync(tmpGeojson)) {
            fs.unlinkSync(tmpGeojson);
        }

    } else {
        argv.geojson = false;
    }

    //count
    argv.count = Boolean(argv.count);

    //filter
    if (argv.filter && fs.existsSync(argv.filter)) {
        argv.filter = JSON.parse(fs.readFileSync(argv.filter));
    } else {
        argv.filter = false;
    }

    //dates
    if (argv.dates) {
        argv.dates = argv.dates.split(',');
        argv.dates = trimStrings(argv.dates);
    } else {
        argv.dates = false;
    }

    //users
    if (argv.users && argv.users.toLowerCase() === 'mapbox') {
        argv.users = mapboxUsernames;
    } else if (argv.users) {
        argv.users = argv.users.split(',');
        argv.users = trimStrings(argv.users);
    } else {
        argv.users = false;
    }

    //bbox
    if (argv.bbox) {
        argv.bbox = argv['bbox'].split(',').map(Number);
        if (!(argv.bbox[0] >= -180 && argv.bbox[0] <= 180) || !(argv.bbox[2] >= -180 && argv.bbox[2] <= 180) || !(argv.bbox[1] >= -90 && argv.bbox[1] <= 90) || !(argv.bbox[3] >= -90 && argv.bbox[0] <= 90)) {
            argv.bbox = false;
        }
    }
    //path
    if (!argv.mbtiles || (path.extname(argv.mbtiles) !== '.mbtiles')) {
        argv.mbtiles = false;
    } else {
        argv.mbtiles = path.normalize(argv.mbtiles);
        if (!fs.existsSync(argv.mbtiles)) {
            argv.mbtiles = false;
        }
    }
    return {'argv': argv, 'tmpGeojson': tmpGeojson};
}

function trimStrings(strings) {
    return strings.map(function (s) {
        return s.trim();
    });
}

module.exports = cleanArguments;
