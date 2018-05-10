const fs = require('fs-extra');
const slug = require('slug');
const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async() => {
  await listings.forEach(async listing => {
    listing.photos.forEach(async (photo, index) => {
      const hasBed = photo.tags.find(tag => {
        const name = tag[0];
        return name === 'person';
      });
      if (hasBed) {
        const file = getUri(`listing-photos/${listing.id}/${index}.jpg`);
        const newFile = getUri(`people/${listing.id} - ${index}.jpg`);
        await fs.copy(file, newFile);
      }
    })
  });
})();
