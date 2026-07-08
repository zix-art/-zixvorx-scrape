const logger = require('./logger');

/**
 * Bungkus fungsi scraper supaya otomatis ke-log (dipanggil, selesai, gagal).
 * @param {string} name
 * @param {Function} fn
 */
function withLogging(name, fn) {
  return async function (...args) {
    const start = Date.now();
    logger.debug(`→ ${name}() dipanggil`);

    try {
      const result = await fn(...args);
      logger.debug(`✓ ${name}() selesai (${Date.now() - start}ms)`);
      return result;
    } catch (error) {
      logger.error(`✗ ${name}() gagal (${Date.now() - start}ms): ${error.message}`);
      throw error;
    }
  };
}

module.exports = { withLogging };
