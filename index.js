const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const fs = require('fs-extra');

const scrapers = require('./scrapers');
const root = 'https://www.airbnb.com/api/v2/explore_tabs';
const constructUrls = ({ neLat, neLon, swLat, swLon }) => {
  let curLat = neLat;
  let curLon = neLon;
  const urls = [];
  // TODO: is this the right amount?
  const piece = 0.001699287017984;
  while (curLat < swLat) {
    curLon = neLon;
    while (curLon < swLon) {
      const url = `https://www.airbnb.com/api/v2/explore_tabs?version=1.3.5&_format=for_explore_search_web&experiences_per_grid=20&items_per_grid=18&guidebooks_per_grid=20&auto_ib=true&fetch_filters=true&has_zero_guest_treatment=false&is_guided_search=true&is_new_cards_experiment=true&luxury_pre_launch=false&query_understanding_enabled=true&show_groupings=true&supports_for_you_v3=true&timezone_offset=120&client_session_id=c99054bc-ffdb-466b-b910-45e78a91c891&metadata_only=false&is_standard_search=true&refinement_paths%5B%5D=%2Fhomes&selected_tab_id=home_tab&allow_override%5B%5D=&ne_lat=${curLat}&ne_lng=${curLon}&sw_lat=${curLat - piece}&sw_lng=${curLon - piece}&search_by_map=true&zoom=18&federated_search_session_id=55eb2e3f-bac5-4e2e-8f90-47ba02198ee1&screen_size=medium&query=Amsterdam%2C+Netherlands&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=EUR&locale=en`;
      urls.push(url);
      curLon += piece;
    }
    curLat += piece;
  }
  return urls;
}

(async () => {
  const uri = './output/ids-to-scrape.json';
  let data = {
    ids: [],
    urls: [],
  };
  if (await fs.exists(uri)) {
    data = await fs.readJson(uri);
  }

  // TODO: coordinates hard coded to Amsterdam, use something like
  // http://www.mapdevelopers.com/geocode_bounding_box.php
  let urls = constructUrls({
    neLat: 52.014772,
    swLat: 52.128537,
    neLon: 4.196710,
    swLon: 4.423026
  });
  const totalCount = urls.length;

  urls = urls.filter(url => !data.urls.includes(url));

  let count = 0;
  let errorCount = 0;
  while (urls.length > 0) {
    console.log(`Scraping ${urls.length} urls`);
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
      { concurrency: 30 }
    );
    urls = urls.filter(url => !data.urls.includes(url))
    console.log(`${urls.length} left`);
    count = 0;
    errorCount = 0;
  }
  fs.outputJsonSync(uri, data);

  const { ids } = data;

  let { ids } = data;
  // Filter out existing ids:
  ids = await Promise.filter(
    ids,
    async id => {
      const exists = await fs.exists(`${__dirname}/${id}.json`);
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
  console.log('Scrape complete');
})();
