'use strict';

var fs = require('fs');
var ff = require('feature-filter');
var featureCollection = require('turf-featurecollection');

/**
 * Filters the OSM features in a single tile based on given filter.
 * @module
 * @type {number}
 */
module.exports = function (data, tile, writeData, done) {

    var filter = (mapOptions.tagFilter) ? ff(mapOptions.tagFilter) : false;
    var layer = data.osm.osm;
    var osmID = (mapOptions.count) ? [] : null;
    var dates = Boolean(mapOptions.dates) ? parseDates(mapOptions.dates) : false;
    var users = mapOptions.users;
    var result = layer.features.filter(function (val) {

        if ((!users || (users && users.indexOf(val.properties['@user']) > -1)) && (
            !mapOptions.dates || (mapOptions.dates && val.properties['@timestamp'] && val.properties['@timestamp'] >= dates[0] && val.properties['@timestamp'] <= dates[1])) && (!filter || (filter && filter(val)))) {

            if (mapOptions.count) {
                osmID.push(val.properties['@id']);
            }

            return true;
        }
    });

    if (mapOptions.tmpGeojson && result.length > 0) {
        var fc = featureCollection(result);
        fs.appendFileSync(mapOptions.tmpGeojson, JSON.stringify(fc) + '\n');
    }
    done(null, osmID);
};

/**
 @function parseDates
 @description Convert Date to timestamp. If endDate is not present, it is set as next immediate date to startDate.
 @param {string[]} strings
 @return {number[]}
 */
function parseDates(dates) {
    var startDate = new Date(dates[0]);
    var endDate = new Date(dates[dates.length - 1]);
    if (dates.length === 1) {
        endDate.setDate((endDate.getDate() + 1));
    }
    //_timestamp in QA tiles is in seconds and not milliseconds
    return [(startDate.getTime() / 1000), (endDate.getTime() / 1000)];
}
