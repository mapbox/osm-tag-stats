'use strict';
var path = require('path');
var fs = require('fs');

function init(argv) {
    var mapboxDataTeam = ['ruthmaben', 'jinalfoflia', 'saikabhi', 'Jothirnadh', 'aarthykc', 'pratikyadav', 'Chetan_Gowda', 'oini', 'ramyaragupathy', 'nikhilprabhakar', 'srividya_c', 'PlaneMad', 'manings', 'nammala', 'poornibadrinath', 'geohacker', 'shvrm', 'bkowshik', 'sanjayb', 'Arunasank', 'Luis36995', 'samely', 'ediyes', 'RichRico', 'andygol', 'karitotp', 'ridixcr', 'calfarome', 'dannykath', 'Rub21', 'Aaron Lidman', 'abel801', 'lxbarth'];

    if (argv.geojson) {
        argv.geojson = (path.extname(argv.geojson) === '.geojson') ? argv.geojson : argv.geojson.concat('.geojson');
        if (fs.existsSync(argv.geojson)) {
            fs.unlinkSync(argv.geojson);
        }
    }
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
        trimStrings(argv.dates);
    }

    //users
    if (argv.users && argv.users.toLowerCase() === 'mapbox') {
        argv.users = mapboxDataTeam;
    } else if (argv.users) {
        argv.users = argv.users.split(',');
        trimStrings(argv.users);
    } else {
        argv.users = false;
    }

    //path
    argv.mbtiles = checkMBTiles(argv.mbtiles);

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
    return argv;
}

module.exports = init;
