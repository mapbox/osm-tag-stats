'use strict';
var turf = require('turf');

module.exports = function(data, tile, writeData, done) {
    var layer = data.osm.osm;
    var osmID = [];
    var users = ["ruthmaben","jinalfoflia","saikabhi","Jothirnadh","aarthykc","pratikyadav","Chetan_Gowda","oini","ramyaragupathy","nikhilprabhakar","srividya_c","PlaneMad","manings","nammala","poornibadrinath","geohacker","shvrm","bkowshik","sanjayb","Arunasank"];
    var result = layer.features.filter(function(val) {
        if (val.properties['ref']  && val.properties['highway'] === 'motorway_junction' && val.properties['_timestamp'] && users.indexOf(val.properties['_user']) > -1 && (val.properties['_timestamp'] >= 1459362600 && val.properties['_timestamp'] <= 1460658600)) {
            osmID.push(val.properties['_osm_way_id'] ? val.properties['_osm_way_id'] : val.properties['_osm_node_id']);
            return true;
        }
    });

    if (result.length > 0) {
        var fc = turf.featurecollection(result);
        writeData(JSON.stringify(fc.features[0]) + '\n');
    }
    done(null, osmID);
};
