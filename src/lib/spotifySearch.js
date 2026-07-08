const { fetchResilient } = require('../utils/httpClient');
const { resolveApiKey } = require('../utils/apiKeyStore');
const { checkDefaultKeyLimit } = require('../utils/defaultKeyLimiter');

/**
 * Cari lagu di Spotify via theresav.biz.id.
 * @param {string} query - kata kunci pencarian
 * @param {string} [apiKey] - opsional, override key dari setApiKey('theresav', ...)
 */
async function spotifySearch(query, apiKey) {
  if (!query) throw new Error('Parameter query tidak boleh kosong');

  const { key, isDefault } = resolveApiKey('theresav', apiKey);
  if (isDefault) await checkDefaultKeyLimit('theresav');

  const url = `https://api.theresav.biz.id/search/spotify?q=${encodeURIComponent(query)}&apikey=${encodeURIComponent(key)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.result;
  } catch (error) {
    throw new Error(`spotifySearch scrape gagal: ${error.message}`);
  }
}

module.exports = spotifySearch;
