var fs = require('fs-extra');
var GeoJSON = require('geojson');

var uri = require('../utils/uri');
var listings = require('../utils/listings');
var neighbourhoods = require('../data/the-hague-neighbourhood.json');
var findNeighbourhood = require('../utils/find-neighbourhood');

(async() => {
  await listings.forEach(listing => {
    const neighbourhood = findNeighbourhood(neighbourhoods, listing);
    if (!neighbourhood) return;
    console.log(neighbourhood);
    // ...
  });
})();
