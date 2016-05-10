'use strict';
var path = require('path');
var fs = require('fs');

function cleanArguments(argv) {
    var mapboxDataTeam = ['ruthmaben', 'jinalfoflia', 'saikabhi', 'Jothirnadh', 'aarthykc', 'pratikyadav', 'Chetan_Gowda', 'oini', 'ramyaragupathy', 'nikhilprabhakar', 'srividya_c', 'PlaneMad', 'manings', 'nammala', 'poornibadrinath', 'geohacker', 'shvrm', 'bkowshik', 'sanjayb', 'Arunasank', 'Luis36995', 'samely', 'ediyes', 'RichRico', 'andygol', 'karitotp', 'ridixcr', 'calfarome', 'dannykath', 'Rub21', 'Aaron Lidman', 'abel801', 'lxbarth'];

    //geojson
    if (argv.geojson) {
        var tmpFilesDir = 'tmp-osm-tag-stats/';
        if(!fs.existsSync(tmpFilesDir)) {
            fs.mkdirSync(tmpFilesDir);
        }

        argv.geojson = (path.extname(argv.geojson) === '.geojson') ? argv.geojson : String(argv.geojson).concat('.geojson');
        argv.tmpGeojson = tmpFilesDir + argv.geojson;

        if (fs.existsSync(argv.geojson)) {
            console.log("deleting argv.geojson");
            fs.unlinkSync(argv.geojson);
        }
        if (fs.existsSync(argv.tmpGeojson)) {
            console.log("deleting argv.tmpGeojson");
            fs.unlinkSync(argv.tmpGeojson);
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
        argv.users = mapboxDataTeam;
    } else if (argv.users) {
        argv.users = argv.users.split(',');
        argv.users = trimStrings(argv.users);
    } else {
        argv.users = false;
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
    return argv;
}

function trimStrings(strings) {
    return strings.map(function(s) {
        return s.trim();
    });
}

module.exports = cleanArguments;
