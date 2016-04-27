'use strict';

var fs = require('fs');
var ff = require('feature-filter');

module.exports = function (data, tile, writeData, done) {

    var filter = (mapOptions.tagFilter) ? ff(mapOptions.tagFilter) : false;
    var layer = data.osm.osm;
    var osmID = (mapOptions.count) ? [] : null;
    var dates = Boolean(mapOptions.dates) ? parseDates(mapOptions.dates) : false;
    var users = mapOptions.users;
    var result = layer.features.filter(function (val) {

        if ((!users || (users && users.indexOf(val.properties['_user']) > -1)) && (
            !mapOptions.dates || (mapOptions.dates && val.properties['_timestamp'] && val.properties['_timestamp'] >= dates[0] && val.properties['_timestamp'] <= dates[1])) && (!filter || (filter && filter(val)))) {

            if (mapOptions.count) {
                osmID.push(val.properties['_osm_way_id'] ? val.properties['_osm_way_id'] : val.properties['_osm_node_id']);
            }

            return true;
        }
    });

    if (result.length > 0 && mapOptions.geojson) {
        if (!mapOptions.count) {
            writeData(JSON.stringify(result) + '\n');
        } else {
            fs.appendFileSync('features.geojson', JSON.stringify(result) + '\n');
        }
    }
    done(null, osmID);

    function parseDates(dates) {
        var startDate = new Date(dates[0]);
        var endDate = new Date(dates[dates.length - 1]);
        if (dates.length === 1) {
            endDate.setDate((endDate.getDate() + 1));
        }
        //_timestamp in QA tiles is in seconds and not milliseconds
        return [(startDate.getTime() / 1000), (endDate.getTime() / 1000)];
    }
};
