const { fetchResilient } = require('../utils/httpClient');

/**
 * Cari meme (gambar/video) di findthatmeme.com.
 * @param {string} searchQuery
 * @param {number} [offset=0]
 */
async function findThatMeme(searchQuery, offset = 0) {
  if (!searchQuery) throw new Error('Parameter searchQuery tidak boleh kosong');

  const url = 'https://findthatmeme.com/api/v1/search';

  try {
    const response = await fetchResilient(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-CSRF-Validation-Header': 'true',
      },
      body: JSON.stringify({ search: searchQuery, offset }),
    });
    return await response.json();
  } catch (error) {
    throw new Error(`findThatMeme scrape gagal: ${error.message}`);
  }
}

module.exports = findThatMeme;
