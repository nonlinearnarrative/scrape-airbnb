const fs = require('fs-extra');
const slug = require('slug');
const listings = require('../utils/listings');
const _ = require('underscore');
const { getUri } = require('../utils/uri');
const imageInfo = require('image-info');
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

      const imageSize = await new Promise(accept => {
        imageInfo(
          getUri(`listing-photos/${listing.id}/${i}.jpg`),
          (err, info) => accept(info)
        )
      });
      let tags = photo.tags.map(
        ([ name, truthFactor, [x, y, width, height]]) => {
          const id = slug(name);
          if (!photosByTag[id]) {
            photosByTag[id] = [];
          }
          photosByTag[id].push(photoId);
          return {
            name: id,
            coordinates: [
              x / imageSize.width,
              y / imageSize.height,
              width / imageSize.width,
              height / imageSize.height
            ]
          };
        }
      );

      // Sorting tag rectangles by rectangle area allows us
      // to draw the rectangles in order allowing the largest
      // rectangles to be at the back and the smallest at the front:
      tags = _.sortBy(
        tags,
        ({ coordinates }) => coordinates[2] * coordinates[3]
      ).reverse();

      await fs.outputJson(
        getUri(`frontend/photos/${photoId}.json`),
        {
          src: photo.xx_large,
          name: listing.name,
          listingId: listing.id,
          photoId,
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
