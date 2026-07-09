const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isEnabled, setDebug } = require('../src/utils/logger');

test('default: logging off', () => {
  setDebug(null);
  delete process.env.DEBUG;
  assert.equal(isEnabled(), false);
});

test('setDebug(true) nyalain logging', () => {
  setDebug(true);
  assert.equal(isEnabled(), true);
  setDebug(null); // reset
});

test('setDebug(false) matiin logging walau env var nyala', () => {
  process.env.DEBUG = 'zxscrape';
  setDebug(false);
  assert.equal(isEnabled(), false);
  setDebug(null);
  delete process.env.DEBUG;
});

test('env var DEBUG=zxscrape nyalain logging', () => {
  process.env.DEBUG = 'zxscrape';
  assert.equal(isEnabled(), true);
  delete process.env.DEBUG;
});

test('env var DEBUG=* nyalain logging', () => {
  process.env.DEBUG = '*';
  assert.equal(isEnabled(), true);
  delete process.env.DEBUG;
});
