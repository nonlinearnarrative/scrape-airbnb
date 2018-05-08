const fs = require('fs-extra');
const listings = require('../utils/listings');

listings.forEach(listing => {
  const description = listing.sectioned_description.description;
  if (!description) return;

  // if (/sorry/.test(description)) {
  //   console.log(listing.sectioned_description.description);
  // }

  var matches = description.match(/([0-9]+)+ minutes to ([^.,]+)/);
  if (matches) console.log(matches[1], matches[2]);
});
