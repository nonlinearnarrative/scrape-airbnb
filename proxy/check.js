const Curl = require( 'node-libcurl' ).Curl;
const Promise = require('bluebird');
const Queue = require('promise-queue');
Queue.configure(Promise);

var maxConcurrent = 60;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);

const checkProxy = async (proxy, testUrl = 'http://apple.com') => {
  let waiting;
  return new Promise(async (resolve, reject) => {
    try {
      var curl = new Curl();
      curl.setOpt('TIMEOUT', 10);
      curl.setOpt('URL', testUrl);
      curl.setOpt('PROXY',
        `${/\:443/.test(proxy)
            ? 'https'
            : 'http'
        }://${proxy}`
      );
      curl.on('end', (statusCode, body) => {
        resolve(statusCode === 200);
        curl.close();
      });
      curl.on('error', err => {
        // console.log(err);
        resolve(false);
        curl.close();
      });
      curl.perform();
    } catch (e) {
      progress.addTick();
      resolve(false);
    }
  });
}

module.exports = (proxies, testUrl, concurrency = 60) => Promise.filter(
  proxies,
  proxy => queue.add(() => checkProxy(proxy, testUrl)),
);
