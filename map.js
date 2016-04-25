'use strict';
var turf = require('turf');

module.exports = function(data, tile, writeData, done) {
    var layer = data.osm.osm;
    var users = ["ruthmaben","jinalfoflia","saikabhi","Jothirnadh","aarthykc","pratikyadav","Chetan_Gowda","oini","ramyaragupathy","nikhilprabhakar","srividya_c","PlaneMad","manings","nammala","poornibadrinath","geohacker","shvrm","bkowshik","sanjayb","Arunasank"];
    var result = layer.features.filter(function(val) {
        if(val.properties['ref']  && val.properties['highway'] === 'motorway_junction' && val.properties['_timestamp'] && users.indexOf(val.properties['_user']) > -1
           && (val.properties['_timestamp'] >= 1462041000000 && val.properties['_timestamp'] <= 1463250600000)){
            return true;
	}
    });

    if (result.length > 0) {
	var fc = turf.featurecollection(result);
	writeData(JSON.stringify(fc.features[0]) + '\n');
    }
    done(null, null);
};
