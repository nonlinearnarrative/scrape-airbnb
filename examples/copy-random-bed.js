const fs = require('fs-extra');
const slug = require('slug');
const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async() => {
  await listings.forEach(async listing => {
    listing.photos.forEach((photo, index) => {
      photo.index = index;
    });
    const beds = listing.photos.filter(photo => {
      return photo.tags.find(tag => {
        const name = tag[0];
        return name === 'bed';
      });
    })
    
    if (beds.length > 0) {
      const index = Math.floor(Math.random() * beds.length);
      const bedPhoto = beds[index];

      const file = getUri(`listing-photos/${listing.id}/${bedPhoto.index}.jpg`);
      const newFile = getUri(`random-bedrooms/${listing.id}.jpg`);
      await fs.copy(file, newFile);
    }
  });
})();
