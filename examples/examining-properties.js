const fs = require('fs-extra');
const listings = require('../utils/listings');

listings.forEach(listing => {
  console.log(listing.name);
});
