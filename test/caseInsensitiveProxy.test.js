const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeCaseInsensitive } = require('../src/utils/caseInsensitiveProxy');

test('exact match diprioritaskan', () => {
  const obj = makeCaseInsensitive({ gita: 'lowercase', Gita: 'capitalized' });
  assert.equal(obj.gita, 'lowercase');
  assert.equal(obj.Gita, 'capitalized');
});

test('case-insensitive fallback kalau exact match gak ada', () => {
  const obj = makeCaseInsensitive({ gita: 'fn' });
  assert.equal(obj.GITA, 'fn');
  assert.equal(obj.Gita, 'fn');
  assert.equal(obj.GiTa, 'fn');
});

test('destructuring tetap jalan', () => {
  const obj = makeCaseInsensitive({ googleNews: 'fn' });
  const { GoogleNews } = obj;
  assert.equal(GoogleNews, 'fn');
});

test('key yang bener-bener gak ada balikin undefined', () => {
  const obj = makeCaseInsensitive({ gita: 'fn' });
  assert.equal(obj.scraperNgasal, undefined);
});

test('`in` operator ikut case-insensitive', () => {
  const obj = makeCaseInsensitive({ gita: 'fn' });
  assert.ok('GITA' in obj);
  assert.ok(!('scraperNgasal' in obj));
});
