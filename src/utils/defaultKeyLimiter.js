const DAILY_LIMIT = 70;
const COUNTER_BASE = 'https://countapi.mileshilliard.com/api/v1/hit';

class DefaultKeyLimitError extends Error {}

function todayKeyName(provider) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD, reset otomatis tiap hari
  return `zxvorx-scrape-${provider}-default-${date}`;
}

/**
 * Cek + increment counter global (shared semua user) untuk pemakaian default key.
 * Lempar DefaultKeyLimitError kalau limit harian sudah habis.
 * Fail-open (tidak memblokir) kalau counter service sendiri gak bisa diakses,
 * supaya outage pihak ketiga gak bikin seluruh module berhenti total.
 * @param {string} provider
 */
async function checkDefaultKeyLimit(provider) {
  const url = `${COUNTER_BASE}/${todayKeyName(provider)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const json = await response.json();
    const count = Number(json.value);

    if (count > DAILY_LIMIT) {
      throw new DefaultKeyLimitError(
        `Limit harian API key default untuk '${provider}' sudah habis (${DAILY_LIMIT}x/hari, dipakai bareng semua pengguna module ini). ` +
          `Coba lagi besok, atau pakai API key kamu sendiri: setApiKey('${provider}', 'KEY_KAMU').`
      );
    }
  } catch (error) {
    if (error instanceof DefaultKeyLimitError) throw error;
    console.warn(
      `[zxvorx/scrape] Gagal cek limit default key (${error.message}), request tetap dilanjutkan.`
    );
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { checkDefaultKeyLimit, DAILY_LIMIT, DefaultKeyLimitError };
