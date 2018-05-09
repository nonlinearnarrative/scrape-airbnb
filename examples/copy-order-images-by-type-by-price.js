const fs = require('fs-extra');
const slug = require('slug');
const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async() => {
  await listings.forEach(async listing => {
    const photoIndex = listing.photos.length > 1 ? 1 : 0;
    const file = getUri(`listing-photos/${listing.id}/${photoIndex}.jpg`);
    const type = slug(listing.room_and_property_type).toLowerCase();
    if (!/private|entire/.test(type)) return;
    const shortType = type.match(/^[^-]+/)[0];

    const newFile = getUri(`entire-or-private-by-price/${shortType}/${listing.p3_event_data_logging.price}-${listing.id}.jpg`);
    await fs.copy(file, newFile);
  });
})();
