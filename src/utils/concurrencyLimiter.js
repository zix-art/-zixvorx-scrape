let maxConcurrent = 5;
let activeCount = 0;
const queue = [];

function drainQueue() {
  while (queue.length > 0 && activeCount < maxConcurrent) {
    activeCount++;
    const resolve = queue.shift();
    resolve();
  }
}

/**
 * Atur berapa banyak scraper yang boleh jalan bersamaan.
 * @param {number} n
 */
function setConcurrencyLimit(n) {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('Concurrency limit harus berupa integer >= 1');
  }
  maxConcurrent = n;
  drainQueue();
}

function getConcurrencyLimit() {
  return maxConcurrent;
}

function getActiveCount() {
  return activeCount;
}

function getQueueLength() {
  return queue.length;
}

function acquire() {
  return new Promise((resolve) => {
    if (activeCount < maxConcurrent) {
      activeCount++;
      resolve();
    } else {
      queue.push(resolve);
    }
  });
}

function release() {
  activeCount--;
  drainQueue();
}

/**
 * Bungkus fungsi scraper biar otomatis dibatasi concurrency-nya.
 * Kalau slot penuh, panggilan baru nunggu di antrean sampai ada slot kosong.
 * @param {Function} fn
 */
function withConcurrencyLimit(fn) {
  return async function (...args) {
    await acquire();
    try {
      return await fn(...args);
    } finally {
      release();
    }
  };
}

module.exports = {
  setConcurrencyLimit,
  getConcurrencyLimit,
  getActiveCount,
  getQueueLength,
  withConcurrencyLimit,
};
