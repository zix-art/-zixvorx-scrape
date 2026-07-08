const logger = require('./logger');

const config = {
  timeout: 10000, // ms, batas waktu tiap request sebelum dianggap gagal
  retries: 3, // jumlah percobaan ulang kalau gagal (di luar percobaan pertama)
  retryDelay: 500, // ms, base delay untuk exponential backoff
  rateLimit: 5, // maksimal request dalam satu window
  rateLimitWindow: 1000, // ms, ukuran window rate limit
};

/**
 * Override konfigurasi http client secara global.
 * @param {Partial<typeof config>} options
 */
function setHttpConfig(options = {}) {
  Object.assign(config, options);
}

function getHttpConfig() {
  return { ...config };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sliding window rate limiter sederhana, dibagi rata ke semua scraper
let requestTimestamps = [];

async function waitForRateLimitSlot() {
  while (true) {
    const now = Date.now();
    requestTimestamps = requestTimestamps.filter(
      (t) => now - t < config.rateLimitWindow
    );

    if (requestTimestamps.length < config.rateLimit) {
      requestTimestamps.push(now);
      return;
    }

    await sleep(50);
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeout);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout setelah ${config.timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch dengan rate limit + retry + timeout otomatis.
 * Return raw Response (biar scraper bebas mau .json() atau .text()).
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
async function fetchResilient(url, options = {}) {
  await waitForRateLimitSlot();

  let lastError;

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    try {
      logger.debug(`fetch percobaan ke-${attempt + 1}: ${url}`);
      const response = await fetchWithTimeout(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === config.retries;

      if (isLastAttempt) {
        logger.error(`fetch gagal total setelah ${attempt + 1}x: ${url} (${error.message})`);
        break;
      }

      const backoff = config.retryDelay * 2 ** attempt;
      logger.warn(`fetch gagal (${error.message}), retry dalam ${backoff}ms: ${url}`);
      await sleep(backoff);
    }
  }

  throw new Error(
    `Request gagal setelah ${config.retries + 1}x percobaan: ${lastError.message}`
  );
}

module.exports = { fetchResilient, setHttpConfig, getHttpConfig };
