const slug = require('slug');
const path = require('path');

const getUri = (file) => {
  const name = process.argv.splice(2, process.argv.length - 1).join(' ');
  const uri = path.join(__dirname, `../output/${slug(name)}`);
  return file
    ? `${uri}/${file}`
    : uri;
};

const getListingFile = id => getUri(`listings/${id}.json`);

module.exports = {
  getUri, getListingFile,
};
