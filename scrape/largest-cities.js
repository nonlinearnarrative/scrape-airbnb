const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const fs = require('fs-extra');
const shortHash = require('short-hash');
const _ = require('underscore');

const { getUri, getListingFile, getLocation, setLocation } = require('../utils/uri');
const listings = require('../utils/listings');
const scrapers = require('./scrapers');
const getGeoBB = require('./geo-bb');

// Cities with population larger than 0.5 million:
let cities = require('all-the-cities')
  .filter(city => city.population > 500000);

setLocation('the world');

(async () => {
  const uri = getUri('ids-to-scrape.json');
  let data = {
    ids: [],
    urls: [],
  };
  if (await fs.exists(uri)) {
    data = await fs.readJson(uri);
  }

  const location = getLocation();
  const piece = 0.197674806;
  let urls = cities.map(
    ({ lat, lon }) => `https://www.airbnb.com/api/v2/explore_tabs?version=1.3.5&_format=for_explore_search_web&experiences_per_grid=20&items_per_grid=18&guidebooks_per_grid=20&auto_ib=true&fetch_filters=true&has_zero_guest_treatment=false&is_guided_search=true&is_new_cards_experiment=true&luxury_pre_launch=false&query_understanding_enabled=true&show_groupings=true&supports_for_you_v3=true&timezone_offset=120&metadata_only=false&is_standard_search=true&refinement_paths%5B%5D=%2Fhomes&selected_tab_id=home_tab&allow_override%5B%5D=&ne_lat=${lat}&ne_lng=${lon}&sw_lat=${lat - piece}&sw_lng=${lon - piece}&search_by_map=true&zoom=12&screen_size=medium&query=Amsterdam%2C+Netherlands&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=EUR&locale=en`
  );
  const totalCount = urls.length;

  urls = urls.filter(url => !data.urls.includes(url));

  let count = 0;
  let errorCount = 0;
  while (urls.length > 0) {
    console.log(`${urls.length} urls left to scrape of a total of ${totalCount}`);
    await Promise.map(
      urls,
      async (url) => {
        const result = await scrapers.getRoomIds(url);
        if (result === 'error') {
          errorCount++;
          return;
        }
        data.urls.push(url);
        if (data.urls.length % 20 === 0) {
          console.log(`${data.urls.length} processed of ${totalCount}, ${errorCount} errors.`);
          fs.outputJsonSync(uri, data);
        }
        if (!result) return;
        result.forEach(id => {
          if (data.ids.includes(id)) return;
          data.ids.push(id);
        });
      },
      { concurrency: 90 }
    );
    urls = urls.filter(url => !data.urls.includes(url))
    count = 0;
    errorCount = 0;
  }
  fs.outputJsonSync(uri, data);

  let { ids } = data;
  // Filter out existing ids:
  ids = await Promise.filter(
    ids,
    async id => {
      const exists = await fs.exists(getListingFile(id));
      return !exists;
    },
    { concurrency: 100 }
  );
  while (ids.length > 0) {
    console.log(`Scraping ${ids.length} ids`);
    ids = await Promise.filter(
      ids,
      scrapers.getRoomData,
      { concurrency: 30 }
    );
  }

  console.log('Downloading images')
  await listings.forEach(
    listing => scrapers.downloadImages(listing),
    60
  );

  console.log('Scrape complete');
})();
