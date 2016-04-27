### Queries mbtiles to generate a geojson

#### Installation

* `git clone git@github.com:mapbox/osm-tag-stats.git`
* `cd osm-tag-stats`
* `npm install`
* `npm link`



#### Usage
`osm-tag-stats --geojson --mbtiles=<path-to-mbtiles>[options]` <br />
 OR <br />
`osm-tag-stats --count --mbtiles=<path-to-mbtiles>[options]`

**The `--mbtiles` option is required. So too is at least one of the `--geojson` or `--count` options.**

#### [options]:
````
  --mbtiles="<path-to-mbtiles-file-from-the-current-directory>"
  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>". If you pass "mapbox", it queries the mbtiles file for all edits from the Mapbox Data Team.
  --filter="<Path to file containing tag filters>" Filters are written as specified in the Mapbox GL JS Filter Spec(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter).
  --dates="startDate[endDate]" Get geojson for user edits in a range of dates. If endDate is not specified, it computes all edits in startDate + 24 hours. (All dates are UTC)
  --count returns total count of filtered features to stdout.
  --geojson="<path-to-write-geojson-to>" Writes the result geojson into a geojson file. If a file by the same name exists, it is overwritten.
  --help  Print this report.
````
