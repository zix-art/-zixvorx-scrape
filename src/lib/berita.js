const { fetchResilient } = require('../utils/httpClient');

async function berita() {
  const url = 'https://api.siputzx.my.id/api/berita/kompas';

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.data;
  } catch (error) {
    throw new Error(`berita scrape gagal: ${error.message}`);
  }
}

module.exports = berita;
