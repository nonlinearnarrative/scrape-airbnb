const Promise = require('bluebird');
const puppeteer = require('puppeteer');

const getBoundingBox = () => {
  return new Promise((resolve, reject) => {
    const status = document.querySelector('#status').innerText;
    let matches = status.match(
      /North Latitude: ([\-0-9.]+) South Latitude: ([\-0-9.]+) East Longitude: ([\-0-9.]+) West Longitude: ([\-0-9.]+)/
    );
    const [, neLat, swLat, neLon, swLon] = matches.map(Number);
    resolve(
      neLat === 0
        ? null
        : { neLat, swLat, neLon, swLon }
    );
  });
};

const retrieveBoundingBox = async (location) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.mapdevelopers.com/geocode_bounding_box.php');
  await page.type('#addressInput', location);
  await page.click('input[value="Go!"]');
  await Promise.delay(500);
  let bb;
  while (!bb) {
    bb = await page.evaluate(getBoundingBox);
  }
  return bb;
};

module.exports = retrieveBoundingBox;