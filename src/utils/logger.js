let overrideEnabled = null; // null = ikut env var, true/false = override manual

function isEnabled() {
  if (overrideEnabled !== null) return overrideEnabled;
  const debugEnv = process.env.DEBUG || '';
  return debugEnv
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

function writeLog(level, ...args) {
  if (!isEnabled()) return;
  const prefix = `[zxscrape:${level}] ${timestamp()}`;
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  fn(prefix, ...args);
}

function debug(...args) {
  writeLog('debug', ...args);
}

function info(...args) {
  writeLog('info', ...args);
}

function warn(...args) {
  writeLog('warn', ...args);
}

function error(...args) {
  writeLog('error', ...args);
}

module.exports = { debug, info, warn, error, isEnabled, setDebug };
