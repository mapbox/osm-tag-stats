'use strict';

var path = require('path');
var fs = require('fs');
var mapboxDataTeam = require('mapbox-data-team');

/**
 @typedef Argument
 @type {object}
 @property {string} mbtiles - path to mbtiles file
 @property {string} users - CSV list of usernames
 @property {string} filter - path to file containing tag filters
 @property {string} dates - CSV UTC format start end dates
 @property {string} geojson - path to write geojson
 */

/**
 @typedef cleanArgument
 @type {object}
 @property {Argument} argv - validated and cleaned up input arguments
 @property {string} tmpGeojson - absolute path of geojson file
 */

/**
 @function cleanArguments
 @description Cleans the arguments, which are to be processed in tile-reduce script
 @param {Argument} argv
 @param {string} tmpFilesDir
 @return {cleanArgument}
 */
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

    //path
    if (!argv.mbtiles || (path.extname(argv.mbtiles) !== '.mbtiles')) {
        argv.mbtiles = false;
    } else {
        argv.mbtiles = path.normalize(argv.mbtiles);
        if (!fs.existsSync(argv.mbtiles)) {
            argv.mbtiles = false;
        }
    }

    //bbox
    if (argv.bbox) {
        argv.bbox = JSON.parse(argv.bbox);
        if (argv.bbox.length !== 4) {
            throw new Error('BBox is invalid --bbox=[west, south, east, north]');
        }
    }

    //tiles
    if (argv.tiles) {
        argv.tiles = JSON.parse(argv.tiles);
        if (typeof(argv.tiles) !== 'object') {
            throw new Error('Tiles is invalid --tiles=[[x, y, z]]');
        }
    }
    return {'argv': argv, 'tmpGeojson': tmpGeojson};
}

/**
 @function trimStrings
 @description trim the extra spaces from the strings
 @param {string[]} strings
 @return {string[]}
 */
function trimStrings(strings) {
    return strings.map(function (s) {
        return s.trim();
    });
}

/**
 * Cleans the arguments passed to main file.
 * @module util/cleanArguments
 * @type {cleanArgument}
 */
module.exports = cleanArguments;
