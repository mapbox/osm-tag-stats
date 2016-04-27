## Queries mbtiles to generate a geojson

The mbtiles files mostly come from [OSM QA TILES](http://osmlab.github.io/osm-qa-tiles/) and work well with any file there! You can also use _osm-tag-stats_ with your own custom mbtiles.

### Installation

* `git clone git@github.com:mapbox/osm-tag-stats.git`
* `cd osm-tag-stats`
* `npm install`
* `npm link`

----------------------------------------------------------

### Usage
`osm-tag-stats --geojson=<output-geojson-file> --mbtiles=<path-to-mbtiles>[options]` <br />
 OR <br />
`osm-tag-stats --count --mbtiles=<path-to-mbtiles>[options]`

**The `--mbtiles` option is required. So too is at least one of the `--geojson` or `--count` options.**

#### Examples

*
`$osm-tag-stats --geojson=highway_primary.geojson --mbtiles='../latest.planet.mbtiles' --filter='filter/highway_primary.json' --users='Mapbox'`
```
Starting up 32 workers... Job started.
Processing tile coords from "osm" source.
2487487 tiles processed in 8m 24s.
The filtered geojson has been written to highway_primary.geojson
```

*
`osm-tag-stats --geojson=highway_primary.geojson --count --mbtiles='../latest.planet.mbtiles' --filter='filter/highway_primary.json' --users='Mapbox'`
```
Starting up 32 workers... Job started.
Processing tile coords from "osm" source.
2487487 tiles processed in 9m 58s.

Features total: 89186
The filtered geojson has been written to highway_primary.geojson
```

----------------------------------------------------------

### [options]:
````
  --mbtiles="<path-to-mbtiles-file-from-the-current-directory>"
  --users="<osm-username-1>","<osm-username-2>","<osm-username-3>". If you pass "mapbox", it queries the mbtiles file for all edits from the Mapbox Data Team. The usernames you pass should be exactly as they're on OSM, that is, they're case sensitive.
  --filter="<Path to file containing tag filters>" Filters are written as specified in the Mapbox GL JS Filter Spec(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter).
  --dates="startDate[endDate]" Get geojson for user edits in a range of dates. If endDate is not specified, it computes all edits in startDate + 24 hours. (All dates are UTC)
  --count returns total count of filtered features to stdout.
  --geojson="<path-to-output-geojson-file>" Writes the resulting geojson into a geojson file. If a file by the same name exists, it is overwritten.
  --help  Print this report.
````
----------------------------------------------------------

### Filters
