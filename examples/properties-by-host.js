const fs = require('fs-extra');

const byHostId = {};

(async() => {
  var files = await fs.readdir('./output-old');
  files = files.filter(file => /[0-9]+\.json/.test(file));
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var listing = await fs.readJson(`./output-old/${file}`);
    if (!byHostId[listing.primary_host.id]) {
      byHostId[listing.primary_host.id] = [];
    }
    byHostId[listing.primary_host.id].push(listing.id);
  }

  const entries = Object.entries(byHostId);
  entries.sort(function (a, b) {
    return b[1].length - a[1].length;
  });

  // At least 10 properties:
  entries.filter(entry => entry[1].length > 10);
  await fs.outputJson('./output-old/properties-by-host.json');
})();