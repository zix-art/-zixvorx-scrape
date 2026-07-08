const fs = require('fs');
const path = require('path');
const { setHttpConfig, getHttpConfig } = require('./utils/httpClient');
const { setApiKey, getApiKey } = require('./utils/apiKeyStore');
const { withLogging } = require('./utils/logWrapper');
const { setDebug } = require('./utils/logger');

const libDir = path.join(__dirname, 'lib');
const scrapers = {};

fs.readdirSync(libDir)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const name = path.basename(file, '.js');
    scrapers[name] = withLogging(name, require(path.join(libDir, file)));
  });

module.exports = { ...scrapers, setHttpConfig, getHttpConfig, setApiKey, getApiKey, setDebug };
