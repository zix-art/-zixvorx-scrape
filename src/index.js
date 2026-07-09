const fs = require('fs');
const path = require('path');
const { setHttpConfig, getHttpConfig } = require('./utils/httpClient');
const { setApiKey, getApiKey } = require('./utils/apiKeyStore');
const { withLogging } = require('./utils/logWrapper');
const { setDebug } = require('./utils/logger');
const { makeCaseInsensitive } = require('./utils/caseInsensitiveProxy');
const {
  withConcurrencyLimit,
  setConcurrencyLimit,
  getConcurrencyLimit,
} = require('./utils/concurrencyLimiter');
const { checkForUpdates, selfUpdate } = require('./utils/selfUpdate');

const libDir = path.join(__dirname, 'lib');
const scrapers = {};

fs.readdirSync(libDir)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const name = path.basename(file, '.js');
    const raw = require(path.join(libDir, file));
    scrapers[name] = withLogging(name, withConcurrencyLimit(raw));
  });

module.exports = makeCaseInsensitive({
  ...scrapers,
  setHttpConfig,
  getHttpConfig,
  setApiKey,
  getApiKey,
  setDebug,
  setConcurrencyLimit,
  getConcurrencyLimit,
  checkForUpdates,
  selfUpdate,
});
