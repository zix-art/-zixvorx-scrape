const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '../src/lib');
const outFile = path.join(__dirname, '../src/index.mjs');

const files = fs.readdirSync(libDir).filter((f) => f.endsWith('.js'));
const names = files.map((f) => path.basename(f, '.js'));

const rawImports = files.map((file, i) => `import _${names[i]} from './lib/${file}';`);
const otherImports = [
  `import { withLogging } from './utils/logWrapper.js';`,
  `import { setHttpConfig, getHttpConfig } from './utils/httpClient.js';`,
  `import { setApiKey, getApiKey } from './utils/apiKeyStore.js';`,
  `import { setDebug } from './utils/logger.js';`,
];

const wrappedConsts = names.map((n) => `const ${n} = withLogging('${n}', _${n});`);

const allExports = [...names, 'setHttpConfig', 'getHttpConfig', 'setApiKey', 'getApiKey', 'setDebug'];
const exportsLine = `export { ${allExports.join(', ')} };`;

const content = [...rawImports, ...otherImports, '', ...wrappedConsts, '', exportsLine, ''].join(
  '\n'
);

fs.writeFileSync(outFile, content);
console.log(
  `✔ Generated src/index.mjs (${names.length} scraper + http config + api key + logging): ${names.join(', ')}`
);
