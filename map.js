'use strict';
var fs = require('fs');
module.exports = function (data, tile, writeData, done) {
    var layer = data.osm.osm;
    var osmID = [];
    var dates = parseDates(mapOptions.dates);
    var users = mapOptions.users;
    var result = layer.features.filter(function(val) {
        if (val.properties['ref']  && val.properties['highway'] === 'motorway_junction' && val.properties['_timestamp'] && users.indexOf(val.properties['_user']) > -1 && (val.properties['_timestamp'] >= dates[0] && val.properties['_timestamp'] <= dates[1])) {

            return true;
        }
    });

    if (result.length > 0 && mapOptions.geojson) {
        if (!mapOptions.count) {
            writeData(JSON.stringify(result) + '\n');
        } else {
            fs.appendFileSync('features.geojson', JSON.stringify(result) + '\n', function (err) {
                if (err) {
                    throw err;
                    process.exit(0);
                }

            });
        }
    }
    done(null, osmID);
};

function parseDates(dates) {
    var startDate = new Date(dates[0]);
    // console.log(startDate);
    // console.log(new Date(startDate.getTime()));
    var endDate = new Date(dates[dates.length - 1]);
    if (startDate === endDate) {
        startDate.setHours(5);
        startDate.setMinutes(30);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(5);
        endDate.setMinutes(30);
    }

    return [startDate.getTime(), endDate.getTime()];
}
