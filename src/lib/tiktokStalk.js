const { fetchResilient } = require('../utils/httpClient');

/**
 * Stalk profil TikTok via siputzx.my.id (tanpa API key).
 * @param {string} username
 */
async function tiktokStalk(username) {
  if (!username) throw new Error('Parameter username tidak boleh kosong');

  const url = `https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(username)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.data;
  } catch (error) {
    throw new Error(`tiktokStalk scrape gagal: ${error.message}`);
  }
}

module.exports = tiktokStalk;
