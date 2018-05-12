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

const loadListing = async uri => {
  var file = path.join(getUri(), 'listings', uri);
  var listing = await fs.readJson(file);
  await Promise.each(
    listing.photos,
    async (photo, index) => {
      const file = getUri(`object_recognition/${listing.id}/${index}.json`);
      var exists = await fs.exists(file);
      photo.file = getUri(`listing-photos/${listing.id}/${index}.jpg`);
      photo.tags = exists
        ? await fs.readJson(file)
        : [];
    }
  )
  return listing;
}

var forEach = async (callback, concurrency) => {
  var files = await listFiles();
  // files = files.filter((file, index) => index % 2 === 0);
  if (concurrency) {
    return Promise.map(
      files,
      async (file, index) => {
        var listing = await loadListing(file);
        await callback(listing, index);  
      },
      { concurrency }
    )
  }
  for (var i = 0; i < files.length; i++) {
    const listing = loadListing(files[i])
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
