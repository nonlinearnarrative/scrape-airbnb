var fs = require('fs-extra');
var Promise = require('bluebird');
var _ = require('underscore');
var { getUri, getListingFile } = require('./uri');

if (!process.argv[2]) {
  throw 'Please provide location name as an argument';
}

var listFiles = async() => {
  var files = await fs.readdir(getUri());
  return files.filter(file => /[0-9]+\.json/.test(file));
};

var forEach = async callback => {
  var files = await listFiles();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var listing = await fs.readJson(getUri(file));
    await callback(listing);
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