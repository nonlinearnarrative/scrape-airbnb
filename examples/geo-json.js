var fs = require('fs-extra');
var GeoJSON = require('geojson');

var uri = require('../utils/uri');
var listings = require('../utils/listings');

(async() => {
  var geoData = {
    type: "FeatureCollection",
    features: []
  };
  await listings.forEach(listing => {
    var feature = GeoJSON.parse(
      listing,
      {
        Point: ['lat', 'lng'],
        include: ['name']
      },
    );
    geoData.features.push(feature);
  });
  var file = uri.getUri('geo.json');
  await fs.outputJson(file, geoData);
  console.log(`Exported ${file}`);
})();
