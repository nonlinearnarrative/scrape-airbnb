const fs = require('fs-extra');
const slug = require('slug');
const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async() => {
  await listings.forEach(async listing => {
    const file = getUri(`listing-photos/${listing.id}/0.jpg`);
    const type = slug(listing.room_and_property_type).toLowerCase();
    const newFile = getUri(`by-type/${type}/${listing.id}.jpg`);
    await fs.copy(file, newFile);
  });
})();
