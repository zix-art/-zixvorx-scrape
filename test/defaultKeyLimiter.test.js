const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkDefaultKeyLimit, DAILY_LIMIT } = require('../src/utils/defaultKeyLimiter');

const originalFetch = global.fetch;

test('lolos kalau count masih di bawah limit', async () => {
  global.fetch = async () => ({ json: async () => ({ value: DAILY_LIMIT - 1 }) });
  await checkDefaultKeyLimit('testprovider'); // gak boleh throw
  global.fetch = originalFetch;
});

test('diblokir kalau count udah lewat limit', async () => {
  global.fetch = async () => ({ json: async () => ({ value: DAILY_LIMIT + 1 }) });
  await assert.rejects(
    () => checkDefaultKeyLimit('testprovider'),
    /Limit harian API key default/
  );
  global.fetch = originalFetch;
});

test('fail-open: gak throw kalau counter service unreachable', async () => {
  global.fetch = async () => {
    throw new Error('unreachable');
  };
  await checkDefaultKeyLimit('testprovider'); // gak boleh throw walau fetch gagal
  global.fetch = originalFetch;
});
