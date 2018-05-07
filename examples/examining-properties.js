const fs = require('fs-extra');
const listings = require('../listings');

listings.forEach(listing => {
  console.log(listing.name);
});
