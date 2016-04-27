### Queries mbtiles to generate a geojson

#### Usage
`index.js --geojson --mbtiles=<path-to-mbtiles>[options]`
 OR 
`index.js --count --mbtiles=<path-to-mbtiles>[options]`


#### [options]:
````
  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>". If you pass "mapbox", it queries mbtiles for all edits from the Mapbox Data Team.
  --filter="<Path to file containing tag filters>" Filters are written as specified in the Mapbox GL JS Filter Spec(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter)
  --mbtiles="<path-to-mbtiles-from-the-current-directory>"
  --dates="startDate[endDate]" Get geojson for user edits in a range of dates. If endDate is not specified, it computes all edits in startDate + 24 hours. (All dates are UTC)
  --count returns total count of filtered features
  --help  Print this report
````
 **The `--mbtiles` option is required. So too is at least one of the `--geojson` or `--count` options.**
