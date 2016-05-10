## osm-tag-stats - filter OSM features, find stats and export GeoJSON using OSM QA Tiles

osm-tag-stats uses [OSM QA Tiles](http://osmlab.github.io/osm-qa-tiles/) and [TileReduce](https://github.com/mapbox/tile-reduce) to filter OSM features and export them to GeoJSON. You can download [planet tiles](https://s3.amazonaws.com/mapbox/osm-qa-tiles/latest.planet.mbtiles.gz) or use [country extracts](http://osmlab.github.io/osm-qa-tiles/country.html). 

_If you are using your own vector tiles, osm-tag-stats currently assumes `osm` as the tile layer._

### Installation

* `git clone git@github.com:mapbox/osm-tag-stats.git`
* `cd osm-tag-stats`
* `npm install`
* `npm link`

### Usage
1. To write GeoJSON to a file: `osm-tag-stats --mbtiles=<path-to-mbtiles> [options] --geojson=<output-geojson-file>` <br />
2. To print the count of features to stdout: `osm-tag-stats --mbtiles=<path-to-mbtiles> [options] --count`

_Path to `--mbtiles` and either of `--geojson` or `--count` is required._

#### Options

| Option | Description
---------|-------
--mbtiles| path to mbtiles file
--users | comma separated list of OSM usernames. You can pass `mapbox` for usernames of @mapbox/team-data.
--filter | path to file containing tag filters. Filters are based on [Mapbox GL Style Filters]( Filters are written as specified in the Mapbox GL JS Filter Specification(https://www.mapbox.com/mapbox-gl-style-spec/#types-filter).
--dates | comma separated UTC format start and end dates. If end date is not supplied, filters start date + 24 hours. 
--count | prints count of filtered features to stdout.
--geojson | path to write geojson, overwrites existing file.
--help | print usage instructions.

### Examples

* `$osm-tag-stats --geojson=highway_primary.geojson --mbtiles='../latest.planet.mbtiles' --filter='filter/highway_primary.json' --users='Mapbox'`

```
The filtered geojson has been written to highway_primary.geojson
```

* `osm-tag-stats --geojson=highway_primary.geojson --count --mbtiles='../latest.planet.mbtiles' --filter='filter/highway_primary.json' --users='Mapbox'`

```
Features total: 89186
The filtered geojson has been written to highway_primary.geojson
```
--------------------------------------------------------------

### Filters

You can specify filters of varying levels of complexity using the [Mapbox GL Style Filter Specification](https://www.mapbox.com/mapbox-gl-style-spec/#types-filter)

* A simple filter for `building=yes` could look like
`["==", "building", "yes"]`

* A filter for `building=yes`, `building:levels>1` and `amenity=parking` could look like
```
[
	"all",
	["==", "building", "yes"],
	["==", "parking", "amenity"],
	[">", "building:levels", 1]
]
```

* A filter for a building with `building:levels<=1` and no `amenity=parking` could look like
```
[
	"all",
	["==", "building", "yes"],
	[
		"none",
		["==", "parking", "amenity"],
		[">", "building:levels", 1]
	]
]
```

* A filter for all highways - `highway=*` can look like
```
["has", "highway"]
```

Create a file with your filter specification and pass the path of this file to the `--filter` argument. There are some presets in the `filter` folder that you can use.
