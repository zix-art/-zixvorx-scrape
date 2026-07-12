const { fetchResilient } = require('../utils/httpClient');

const BASE_URL = 'https://clip.cafe';
const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36';

/**
 * Cari klip film berdasarkan kutipan/quote di clip.cafe.
 * @param {string} phrase
 * @param {object} [options]
 * @param {string} [options.lang='en']
 * @param {number} [options.from=0]
 * @param {number} [options.size=90]
 */
async function clipCafeSearch(phrase, options = {}) {
  if (!phrase) throw new Error('Frasa/quote yang dicari wajib diisi');

  const { lang = 'en', from = 0, size = 90 } = options;
  const encodedPhrase = encodeURIComponent(phrase);
  const url = `${BASE_URL}/?phrasefind=${encodedPhrase}&lang=${lang}&from=${from}&size=${size}`;

  try {
    const response = await fetchResilient(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': USER_AGENT,
        Referer: `${BASE_URL}/s/${encodedPhrase.replace(/%20/g, '+')}`,
      },
    });
    return await response.json();
  } catch (error) {
    throw new Error(`clipCafeSearch scrape gagal: ${error.message}`);
  }
}

module.exports = clipCafeSearch;
