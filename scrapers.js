const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const getProxy = require('./proxy');
const Curl = require( 'node-libcurl' ).Curl;
var randomUA = require('random-fake-useragent');

const testRedirect = (url, proxy) => {
  return new Promise((resolve, reject) => {
    var curl = new Curl();
    curl.setOpt('TIMEOUT', 5);
    curl.setOpt('URL', url.trim());
    curl.setOpt('FOLLOWLOCATION', false);
    curl.setOpt(
      'PROXY',
      `${/\:443/.test(proxy) ? 'https' : 'http'}://${proxy}`
    );
    curl.setOpt(
      'WRITEFUNCTION',
      () => {
        resolve(true);
        return 0;
      }
    );
    curl.on('error', err => {
      console.log('redirected');
      resolve(false);
      curl.close();
    });
    curl.perform();
  });
}

const curlGet = (url, proxy) => {
  return new Promise((resolve, reject) => {
    var curl = new Curl();
    const settings = {
      TIMEOUT: 20,
      URL: url,
      FOLLOWLOCATION: false,
      PROXY: `${/\:443/.test(proxy) ? 'https' : 'http'}://${proxy}`,
      USERAGENT: randomUA.getRandom(),
    };
    Object.entries(settings)
      .forEach(
        ([key, value]) => curl.setOpt(key, value)
      );
    curl.on('end', (statusCode, body, headers) => {
      (statusCode === 200 ? resolve : reject)(body);
      curl.close();
    });
    curl.on('error', () => {
      reject();
      curl.close();
    });
    curl.perform();
  });
}

const getJson = () => {
  return new Promise((resolve, reject) => {
    if (/503 Service Temporarily Unavailable/.test(document.body.innerHTML)) {
      resolve('blocked');
    }
    const script = document.querySelector('script[data-hypernova-key="spaspabundlejs"]');
    const json = script.innerText
      .replace(/<!--|-->/g, '');
    resolve(json);
  });
};

const blockResourceRequests = (request) => {
  const abort = /image|stylesheet|font|script/
    .test(request.resourceType());
  if (abort) {
    request.abort();
  } else {
    request.continue();
  }
}

module.exports = {
  getRoomData: async(id) => {
    const outputFile = `./output/${id}.json`;
    const url = `https://www.airbnb.com/rooms/${id}`;

    const exists = await fs.exists(outputFile);
    if (exists) return false;

    const proxy = await getProxy();
    const redirects = await testRedirect(url, proxy);
    if (redirects) return false;

    const browser = await puppeteer.launch({
      headless: true,
      args: [ `--proxy-server=${proxy}` ]
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', blockResourceRequests);
    try {
      await page.setViewport({ width: 1024, height: 768 });
      const going = page.goto(url);
      let loaded = false;
      await new Promise((resolve, reject) => {
        loaded = true;
        page.on('domcontentloaded', resolve);
        going.catch(reject);
      });
      let res = await page.evaluate(getJson);
      if (res === 'blocked') {
        await browser.close();
        console.log('BLOCKED!');
        return false;
      }
      const data = JSON.parse(res);
      if (!data.bootstrapData.reduxData.homePDP) {
        await browser.close();
        return;
      }
      const listingData = data.bootstrapData.reduxData.homePDP.listingInfo.listing;
      await fs.outputJson(outputFile, listingData);
      console.log(`Outputted ./output/${id}.json`);
      await browser.close();
      return false;
    } catch (e) {
      await browser.close();
      return true;
    }
  },
  getRoomIds: async (url) => {
    let result;
    try {
      const proxy = await getProxy();
      result = await curlGet(url, proxy);
      return JSON.parse(result)
        .explore_tabs[0]
        .home_tab_metadata
        .remarketing_ids;
    } catch (e) {
      return 'error';
    }
  }
};

