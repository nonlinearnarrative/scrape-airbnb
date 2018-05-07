const fs = require('fs-extra');

(async() => {
  var files = await fs.readdir('./output');
  files = files.filter(file => /[0-9]+\.json/.test(file));
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var listing = await fs.readJson(`./output/${file}`);
    // var description = listing.sectioned_description.description;
    // if (/we are on holiday/.test(description)) {
    //   console.log(description);
    // }
  }
})();
