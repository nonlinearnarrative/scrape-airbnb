const Curl = require( 'node-libcurl' ).Curl;
const randomUA = require('random-fake-useragent');

module.exports = (url, proxy) => {
  return new Promise((resolve, reject) => {
    var curl = new Curl();
    const settings = {
      TIMEOUT: 20,
      URL: url,
      FOLLOWLOCATION: false,
      USERAGENT: randomUA.getRandom(),
    };
    Object.entries(settings)
      .forEach(
        ([key, value]) => curl.setOpt(key, value)
      );
    if (proxy) {
      curl.setOpt(
        'PROXY',
        `${/\:443/.test(proxy) ? 'https' : 'http'}://${proxy}`
      );
    }
    curl.on('end', (statusCode, body, headers) => {
      if (statusCode === 200) {
        resolve(body);
      } else {
        reject('not found');
      }
      curl.close();
    });
    curl.on('error', (e) => {
      reject('connection error');
      curl.close();
    });
    curl.perform();
  });
}