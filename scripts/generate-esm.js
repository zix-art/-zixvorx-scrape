const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '../src/lib');
const outFile = path.join(__dirname, '../src/index.mjs');

const files = fs.readdirSync(libDir).filter((f) => f.endsWith('.js'));
const names = files.map((f) => path.basename(f, '.js'));

const rawImports = files.map((file, i) => `import _${names[i]} from './lib/${file}';`);
const otherImports = [
  `import { withLogging } from './utils/logWrapper.js';`,
  `import { withConcurrencyLimit, setConcurrencyLimit, getConcurrencyLimit } from './utils/concurrencyLimiter.js';`,
  `import { setHttpConfig, getHttpConfig } from './utils/httpClient.js';`,
  `import { setApiKey, getApiKey } from './utils/apiKeyStore.js';`,
  `import { setDebug } from './utils/logger.js';`,
  `import { checkForUpdates, selfUpdate } from './utils/selfUpdate.js';`,
  `import { makeCaseInsensitive } from './utils/caseInsensitiveProxy.js';`,
];

const wrappedConsts = names.map(
  (n) => `const ${n} = withLogging('${n}', withConcurrencyLimit(_${n}));`
);

const allExports = [
  ...names,
  'setHttpConfig',
  'getHttpConfig',
  'setApiKey',
  'getApiKey',
  'setDebug',
  'setConcurrencyLimit',
  'getConcurrencyLimit',
  'checkForUpdates',
  'selfUpdate',
];
const exportsLine = `export { ${allExports.join(', ')} };`;
const defaultObjLine = `const _all = { ${allExports.join(', ')} };`;
const defaultExportLine = `export default makeCaseInsensitive(_all);`;

const content = [
  ...rawImports,
  ...otherImports,
  '',
  ...wrappedConsts,
  '',
  exportsLine,
  defaultObjLine,
  defaultExportLine,
  '',
].join('\n');

fs.writeFileSync(outFile, content);
console.log(
  `✔ Generated src/index.mjs (${names.length} scraper + http config + api key + logging + concurrency + self-update): ${names.join(', ')}`
);
