var fs = require('fs-extra');
var listings = require('../utils/listings');
var getUri = require('../utils/uri');

var byHostId = {};

(async() => {
  await listings.forEach(listing => {
    var id = listing.primary_host.id;
    if (!byHostId[id]) {
      byHostId[id] = [];
    }
    byHostId[id].push(listing.id);
  });

  var entries = Object.entries(byHostId);

  // Sort by amount of properties:
  entries.sort((a, b) => b[1].length - a[1].length);

  // At least 3 properties:
  entries = entries.filter(entry => entry[1].length > 3);
  var output = getUri('properties-by-host.json');
  console.log(`Outputted ${entries.length} hosts to ${output}`);
  await fs.outputJson(output);
})();
