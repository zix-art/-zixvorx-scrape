const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  setConcurrencyLimit,
  getConcurrencyLimit,
  getActiveCount,
  withConcurrencyLimit,
} = require('../src/utils/concurrencyLimiter');

test('getConcurrencyLimit() balikin default 5', () => {
  assert.equal(getConcurrencyLimit(), 5);
});

test('setConcurrencyLimit() ubah limit', () => {
  setConcurrencyLimit(3);
  assert.equal(getConcurrencyLimit(), 3);
  setConcurrencyLimit(5); // reset ke default buat test lain
});

test('setConcurrencyLimit() tolak nilai invalid', () => {
  assert.throws(() => setConcurrencyLimit(0));
  assert.throws(() => setConcurrencyLimit(-1));
  assert.throws(() => setConcurrencyLimit(1.5));
});

test('withConcurrencyLimit() gak pernah lebih dari limit yang jalan bareng', async () => {
  setConcurrencyLimit(2);

  let maxObserved = 0;
  const wrapped = withConcurrencyLimit(async () => {
    maxObserved = Math.max(maxObserved, getActiveCount());
    await new Promise((r) => setTimeout(r, 30));
  });

  await Promise.all(Array.from({ length: 6 }, () => wrapped()));

  assert.ok(maxObserved <= 2, `Expected max 2, got ${maxObserved}`);
  setConcurrencyLimit(5); // reset
});

test('withConcurrencyLimit() tetap balikin hasil yang bener per panggilan', async () => {
  setConcurrencyLimit(2);
  const wrapped = withConcurrencyLimit(async (id) => {
    await new Promise((r) => setTimeout(r, 10));
    return id * 2;
  });

  const results = await Promise.all([1, 2, 3, 4].map((id) => wrapped(id)));
  assert.deepEqual(results, [2, 4, 6, 8]);
  setConcurrencyLimit(5); // reset
});
