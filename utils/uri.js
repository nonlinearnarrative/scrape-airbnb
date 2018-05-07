const slug = require('slug');
const path = require('path');

const getLocation = () => {
  const [,, ...args] = process.argv;
  return args.join(' ')
};

const getUri = (file) => {
  const location = slug(getLocation());
  const uri = path.join(__dirname, `../output/${location}`);
  return file
    ? `${uri}/${file}`
    : uri;
};

const getListingFile = id => getUri(`listings/${id}.json`);

module.exports = {
  getUri, getListingFile, getLocation
};
