var fs = require('fs-extra');
var path = require('path');
var Canvas = require('canvas');
const Image = Canvas.Image;

const listings = require('../utils/listings');
const { getUri } = require('../utils/uri');

(async () => {
    await listings.forEach(async listing => {
        listing.photos.forEach(async (photo, index) => {
            const hasBed = photo.tags.find(tag => {
                const name = tag[0];
                return name === 'bed';
            });
            if (!hasBed) return;
            const file = getUri(`listing-photos/${listing.id}/${index}.jpg`);
            const newFile = getUri(`no-more-bed/${listing.id}/${index}.jpg`);
            const buffer = await fs.readFile(file)
            const img = new Image();
            img.src = buffer;
            const canvas = new Canvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            ctx.fillStyle = '#fd5c63';
            for (tag of photo.tags) {
                // if (tag[0] !== 'bed') continue;
                const [x, y, width, height] = tag[2];
                ctx.save();
                ctx.translate(width * -0.5, height * -0.5);
                ctx.fillRect(...tag[2]);      
                ctx.restore();          
            }
            await fs.outputFile(newFile, canvas.toBuffer());
        })
    });
})();