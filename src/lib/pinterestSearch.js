const { fetchResilient } = require('../utils/httpClient');

/**
 * Cari gambar/pin di Pinterest.
 * @param {string} query - kata kunci pencarian
 * @param {number} [limit=15]
 */
async function pinterestSearch(query, limit = 15) {
  if (!query) throw new Error('Parameter query tidak boleh kosong');

  const url = new URL('https://dipastebin.web.id/api/pinterest/search');
  url.searchParams.set('query', query);
  url.searchParams.set('limit', String(limit));

  try {
    const response = await fetchResilient(url.toString());
    const json = await response.json();

    if (!json.status) throw new Error('Search failed');
    return json.results;
  } catch (error) {
    throw new Error(`pinterestSearch scrape gagal: ${error.message}`);
  }
}

module.exports = pinterestSearch;
