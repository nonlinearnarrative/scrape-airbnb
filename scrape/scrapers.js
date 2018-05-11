const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const request = require('../utils/request');
const getProxy = require('./proxy');
const { getUri, getListingFile } = require('../utils/uri');
const Promise = require('bluebird');

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

const getRoomData = async id => {
  const outputFile = getListingFile(id);
  const url = `https://www.airbnb.com/rooms/${id}`;

  const exists = await fs.exists(outputFile);
  if (exists) return false;

  const proxy = await getProxy();

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
    console.log(`Outputted ${outputFile}`);
    await browser.close();
    return false;
  } catch (e) {
    await browser.close();
    return true;
  }
}

const getRoomIds = async url => {
  try {
    const proxy = await getProxy();
    const result = await request.get(url, proxy);
    return JSON.parse(result)
      .explore_tabs[0]
      .home_tab_metadata
      .remarketing_ids;
  } catch (e) {
    if (!/not found|connection error/.test(e)) {
      console.log(e);
    }
    return 'error';
  }
};

const Queue = require('promise-queue');
Queue.configure(Promise);
const downloadQueue = new Queue(80, Infinity);

const downloadImages = async listing => {
  let photos = listing.photos.map(
    (photo, index) => (
      {
        url: photo.xx_large,
        file: getUri(`listing-photos/${listing.id}/${index}.jpg`)
      }
    )
  );

  photos.push({
    url: listing.primary_host.profile_pic_path,
    file: getUri(`host-photos/${listing.id}.jpg`)
  });
  
  while (photos.length) {
    photos = await Promise.filter(
      photos,
      async ({ file }) => {
        const exists = await fs.exists(file);
        return !exists;
      }
    );
    await Promise.each(
      photos,
      async ({ url, file }, index) => {
        await fs.mkdirs(path.dirname(file));
        return downloadQueue.add(
          () => request.download(url, file)
        );
      }
    )  
  }
}

module.exports = {
  getRoomData,
  getRoomIds,
  downloadImages,
};

