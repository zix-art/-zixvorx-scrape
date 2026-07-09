const { test } = require('node:test');
const assert = require('node:assert/strict');
const { setApiKey, getApiKey, resolveApiKey } = require('../src/utils/apiKeyStore');

test('resolveApiKey() pakai default kalau gak ada apa-apa', () => {
  const { key, isDefault } = resolveApiKey('theresav');
  assert.equal(key, 'JGxNW');
  assert.equal(isDefault, true);
});

test('resolveApiKey() prioritaskan key hasil setApiKey di atas default', () => {
  setApiKey('theresav', 'KEY_USER_TEST');
  const { key, isDefault } = resolveApiKey('theresav');
  assert.equal(key, 'KEY_USER_TEST');
  assert.equal(isDefault, false);
});

test('resolveApiKey() explicit key menang di atas semuanya', () => {
  setApiKey('theresav', 'KEY_USER_TEST');
  const { key, isDefault } = resolveApiKey('theresav', 'KEY_EXPLICIT');
  assert.equal(key, 'KEY_EXPLICIT');
  assert.equal(isDefault, false);
});

test('setApiKey() nolak provider/key kosong', () => {
  assert.throws(() => setApiKey('', 'x'));
  assert.throws(() => setApiKey('theresav', ''));
});

test('getApiKey() balikin undefined buat provider yang belum di-set', () => {
  assert.equal(getApiKey('providerNgasal'), undefined);
});

test('resolveApiKey() lempar error kalau provider gak dikenal & gak ada default', () => {
  assert.throws(() => resolveApiKey('providerNgasal'));
});
               
