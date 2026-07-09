const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkForUpdates } = require('../src/utils/selfUpdate');
const pkg = require('../package.json');

const originalFetch = global.fetch;

test('hasUpdate true kalau registry punya versi lebih baru', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ version: '999.0.0' }) });
  const result = await checkForUpdates();
  assert.equal(result.hasUpdate, true);
  assert.equal(result.latest, '999.0.0');
  assert.equal(result.current, pkg.version);
  global.fetch = originalFetch;
});

test('hasUpdate false kalau versi sama', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ version: pkg.version }) });
  const result = await checkForUpdates();
  assert.equal(result.hasUpdate, false);
  global.fetch = originalFetch;
});

test('fail gracefully kalau registry gak bisa diakses', async () => {
  global.fetch = async () => {
    throw new Error('offline');
  };
  const result = await checkForUpdates(); // gak boleh throw
  assert.equal(result.hasUpdate, false);
  assert.equal(result.latest, null);
  assert.ok(result.error);
  global.fetch = originalFetch;
});
