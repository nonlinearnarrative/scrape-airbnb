const fs = require('fs-extra');
const slug = require('slug');
const _ = require('underscore');
const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async() => {
  const list = await listings.all();
  const sorted = _.sortBy(
    list,
    listing => listing.p3_event_data_logging.price
  );
  for (var i = 0; i < sorted.length; i++) {
    const listing = sorted[i];
    const file = getUri(`listing-photos/${listing.id}/0.jpg`);
    const newFile = getUri(`by-price/${listing.p3_event_data_logging.price}-${listing.id}.jpg`);
    await fs.copy(file, newFile);
  }
})();
