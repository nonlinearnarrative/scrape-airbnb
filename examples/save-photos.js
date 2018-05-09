const fs = require('fs-extra');
const listings = require('../utils/listings');
const download = require('download-to-file');
 
listings.forEach(async listing => {
    if (listing.photos.length > 0) {
        download(listing.photos[0].large.split('?')[0], `${__dirname}/../photos/${listing.id}.jpg`, (err, filepath) => {
		  if (err) throw err
		  console.log(`Saved listing #${listing.id}`)
		});
      
    }
});
