'use strict';
function help() {
    console.log('*********************************************************************************************************\n');
    console.log('Queries OSM QA tiles to generate a geojson after applying the following filters.\n');
    console.log('index.js --geojson --mbtiles=<path-to-mbtiles>[options] OR index.js --count --mbtiles=<path-to-mbtiles>[options]\n');
    console.log(' The --mbtiles argument is REQUIRED. So is AT LEAST ONE of the --geojson or --count arguments\n');
    console.log('[options]:');
    console.log('  --geojson="<path-to-write-geojson-to>" Writes the result geojson into a geojson file. If a file by the same name exists, it is overwritten.');
    console.log('  --count returns total count of filtered features');
    console.log('  --mbtiles="<path-to-mbtiles-from-the-current-directory>"');
    console.log('  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>". If you pass "mapbox", it queries mbtiles for all edits from the Mapbox Data Team.');
    console.log('  --filter="<Path to file containing tag filters>" Filters are written as specified in the Mapbox GL JS Filter Spec(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter)');
    console.log('  --dates="startDate[,endDate]" Get geojson for user edits in a range of dates. If endDate is not specified, it computes all edits in startDate + 24 hours. (All dates are considered in the UTC)');
    console.log('  --help  Print this report\n');
    console.log('*********************************************************************************************************');
    process.exit(0);
}
module.exports = help;
