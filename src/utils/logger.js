let overrideEnabled = null; // null = ikut env var, true/false = override manual

function isEnabled() {
  if (overrideEnabled !== null) return overrideEnabled;
  const debug = process.env.DEBUG || '';
  return debug
    .split(',')
    .map((d) => d.trim())
    .some((d) => d === '*' || d === 'zxscrape' || d === 'zxscrape:*');
}

/**
 * Nyalain/matiin logging secara manual, override env var DEBUG.
 * @param {boolean} enabled
 */
function setDebug(enabled) {
  overrideEnabled = enabled;
}

function timestamp() {
  return new Date().toISOString();
}

function log(level, ...args) {
  if (!isEnabled()) return;
  const prefix = `[zxscrape:${level}] ${timestamp()}`;
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  fn(prefix, ...args);
}

module.exports = {
  debug: (...args) => log('debug', ...args),
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  isEnabled,
  setDebug,
};
