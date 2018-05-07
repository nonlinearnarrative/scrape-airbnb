const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const fs = require('fs-extra');
const _ = require('underscore');
var ProxyLists = require('proxy-lists');

const proxiesCache = require('./proxy-cache.json');
const checkProxies = require('./check');

let index = 0;
let allProxies = [];

const getUncheckedProxies = () => {
  const gettingProxies = require('proxy-lists').getProxies();
  const uncheckedProxies = [];
  return new Promise((approve) => {
    gettingProxies.on('data', async (proxies) => {
      uncheckedProxies.push(...proxies);
      if (uncheckedProxies.length > 5000) {
        approve(uncheckedProxies);
      }
    });
    
    gettingProxies.on('error', () => {
      // noop
    });
  });
}

const findProxies = async() => {
  const needCount = 50;
  console.log('Finding proxies');
  const testUrl = 'https://www.airbnb.com/api/v2/explore_tabs?version=1.3.5&_format=for_explore_search_web&experiences_per_grid=20&items_per_grid=18&guidebooks_per_grid=20&auto_ib=true&fetch_filters=true&has_zero_guest_treatment=false&is_guided_search=true&is_new_cards_experiment=true&luxury_pre_launch=false&query_understanding_enabled=true&show_groupings=true&supports_for_you_v3=true&timezone_offset=120&metadata_only=false&is_standard_search=true&refinement_paths%5B%5D=%2Fhomes&selected_tab_id=home_tab&allow_override%5B%5D=&ne_lat=52.359704776863275&ne_lng=4.8715961095106515&sw_lat=52.35800548984529&sw_lng=4.8698968224926675&search_by_map=true&zoom=18&federated_search_session_id=55eb2e3f-bac5-4e2e-8f90-47ba02198ee1&screen_size=medium&query=Amsterdam%2C+Netherlands&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=EUR&locale=en';
  try {
    console.log(`Checking ${proxiesCache.length} proxies in cached proxy-list`);
    allProxies = await checkProxies(proxiesCache, testUrl);
    if (allProxies.length > needCount) {
      console.log(`Done – ${allProxies.length} cached proxies found!`);
      return;
    }
    const uncheckedProxies = await getUncheckedProxies();
    while (allProxies.length < needCount) {
      console.log(`${allProxies.length} working proxies found, need ${needCount - allProxies.length} more..`);
      const chunk = [];
      while (chunk.length < 300) {
        chunk.push(
          uncheckedProxies.splice(
            _.random(0, uncheckedProxies.length),
            1
          )[0]
        );
      }
      const checkedChunk = await checkProxies(
        chunk
          .filter(proxy => !!proxy)
          .map(proxy => `${proxy.ipAddress}:${proxy.port}`),
        testUrl
      );
      allProxies.push(...checkedChunk);
    }
    console.log(`Done – ${allProxies.length} proxies found.`);
    fs.outputJsonSync(
      `${__dirname}/proxy-cache.json`,
      allProxies
    );
  } catch (err) {
    throw err;
  }
  console.log(allProxies.length);
};

let starting = findProxies();

setInterval(() => {
  starting = findProxies();
}, 60 * 1000 * 30);

module.exports = async () => {
  await starting;
  return allProxies[index++ % allProxies.length];
};

