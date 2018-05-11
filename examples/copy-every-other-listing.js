const fs = require('fs-extra');
const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async () => {
    count = 0
    await listings.forEach(async listing => {
        if (count % 2 === 0) {
            const directory = getUri(`listing-photos/${listing.id}`);
            const newDirectory = getUri(`every-other/${listing.id}`);
            await fs.copy(directory, newDirectory);
        }

        count += 1
    });
})();
