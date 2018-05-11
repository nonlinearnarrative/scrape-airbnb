const fs = require('fs-extra');
const slug = require('slug');
const listings = require('../utils/listings');
const _ = require('underscore');
const { getUri } = require('../utils/uri');

let count = 0;

const photosByTag = {};

(async() => {
  await listings.forEach(async (listing, listingIndex) => {
    const filteredPhotos = listing.photos.filter(
      photo => photo.tags.length >= 3
    );

    for (var i = 0; i < filteredPhotos.length; i++) {
      count++;
      if (count % 100 === 0) {
        console.log(`Progress: ${count} images processed`)
      }
      const photo = filteredPhotos[i];
      const photoId = `${listingIndex}-${i}`;

      let tags = photo.tags.map(
        ([ name, truthFactor, coordinates]) => {
          const id = slug(name);
          if (!photosByTag[id]) {
            photosByTag[id] = [];
          }
          photosByTag[id].push(photoId);
          return { name: id, coordinates };
        }
      );

      // Sorting tag rectangles by rectangle area allows us
      // to draw the rectangles in order allowing the largest
      // rectangles to be at the back and the smallest at the front:
      tags = _.sortBy(
        tags,
        ({ coordinates }) => coordinates.width * coordinates.height
      ).reverse();

      await fs.outputJson(
        getUri(`frontend/photos/${photoId}.json`),
        {
          src: photo.xx_large,
          name: listing.name,
          listingId: listing.id,
          tags
        }
      );
    }
  });

  var promises = Object.entries(photosByTag)
    .map(([tagName, photoIds]) => {
      return fs.outputJson(
        getUri(`frontend/tags/${tagName}.json`),
        photoIds
      );
    });
  await Promise.all(promises);
})();
