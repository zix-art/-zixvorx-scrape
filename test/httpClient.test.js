const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fetchResilient, setHttpConfig, getHttpConfig } = require('../src/utils/httpClient');

const originalFetch = global.fetch;

test('fetchResilient() sukses di percobaan pertama', async () => {
  global.fetch = async () => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({ ok: true }),
  });
  setHttpConfig({ retries: 3, retryDelay: 10, timeout: 5000 });

  const res = await fetchResilient('https://fake.url');
  const json = await res.json();
  assert.deepEqual(json, { ok: true });

  global.fetch = originalFetch;
});

test('fetchResilient() retry sampai sukses', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    if (calls < 3) throw new Error('network blip');
    return { ok: true, status: 200, statusText: 'OK', json: async () => ({ attempt: calls }) };
  };
  setHttpConfig({ retries: 3, retryDelay: 10 });

  const res = await fetchResilient('https://fake.url');
  const json = await res.json();
  assert.equal(json.attempt, 3);
  assert.equal(calls, 3);

  global.fetch = originalFetch;
});

test('fetchResilient() lempar error setelah retry habis', async () => {
  global.fetch = async () => {
    throw new Error('down terus');
  };
  setHttpConfig({ retries: 2, retryDelay: 10 });

  await assert.rejects(
    () => fetchResilient('https://fake.url'),
    /Request gagal setelah 3x percobaan/
  );

  global.fetch = originalFetch;
});

test('fetchResilient() lempar error kalau response.ok false', async () => {
  global.fetch = async () => ({ ok: false, status: 404, statusText: 'Not Found' });
  setHttpConfig({ retries: 0, retryDelay: 10 });

  await assert.rejects(() => fetchResilient('https://fake.url'), /HTTP 404/);

  global.fetch = originalFetch;
  setHttpConfig({ retries: 3 }); // reset
});

test('setHttpConfig()/getHttpConfig() override tersimpan', () => {
  setHttpConfig({ timeout: 1234 });
  assert.equal(getHttpConfig().timeout, 1234);
});
