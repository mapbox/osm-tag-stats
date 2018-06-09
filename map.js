'use strict';

const fs = require('fs');
const featureCollection = require('turf-featurecollection');
const turf = require('@turf/turf');
const counties = require('./counties.json');

module.exports = function (data, tile, writeData, done) {
    const result = [];
    const features = data.osm.osm.features.filter((feature) => feature.geometry.type === 'LineString');

    features.forEach((feature) => {
        if (feature.geometry.type === 'LineString') {
            counties.features.forEach((county) => {
                if (turf.booleanContains(county, feature)) {
                    feature.properties.county = county.properties.NAME;
                    result.push(feature);
                } else if (turf.lineIntersect(county, feature).features.length) {
                    result.push(turf.lineSplit(feature, county));
                }
            });
        }
    });

    if (mapOptions.tmpGeojson && result.length) {
        const fc = featureCollection(result);
        fs.appendFileSync(mapOptions.tmpGeojson, JSON.stringify(fc) + '\n');
    }
    done();
};
