var fs = require('fs-extra');
var path = require('path');
var Promise = require('bluebird');
var _ = require('underscore');
var { getUri, getListingFile } = require('./uri');

if (!process.argv[2]) {
  throw 'Please provide location name as an argument';
}


// window.location.hash

var listFiles = async() => {
  var dir = path.join(getUri(), 'listings');
  var files = await fs.readdir(dir);
  return files.filter(file => /[0-9]+\.json/.test(file));
};

var forEach = async (callback, concurrency) => {
  var files = await listFiles();
  // files = files.filter((file, index) => index % 2 === 0);
  if (concurrency) {
    return Promise.map(
      files,
      async (file, index) => {
        var listing = await fs.readJson(
          path.join(getUri(), 'listings', file)
        );
        await callback(listing, index);  
      },
      { concurrency: 10 }
    )
  }
  for (var i = 0; i < files.length; i++) {
    var file = path.join(getUri(), 'listings', files[i]);
    var listing = await fs.readJson(file);
    await Promise.each(
      listing.photos,
      async (photo, index) => {
        const file = getUri(`object_recognition/${listing.id}/${index}.json`);
        var exists = await fs.exists(file);
        photo.tags = exists
          ? await fs.readJson(file)
          : [];
      }
    )
    await callback(listing, i);
  }
}

var all = async() => {
  var listings = [];
  await forEach(listing => {
    listings.push(listing);
  })
  return listings;
}

var getById = async id => {
  var uri = getListingFile(id);
  var exists = await fs.exists(uri);
  if (!exists) throw `Listing not found: ${uri}`;
  return fs.readJson(uri);
}

module.exports = { forEach, all, getById };
