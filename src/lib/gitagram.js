const { fetchResilient } = require('../utils/httpClient');

async function gitagram(search) {
  if (!search) throw new Error('Parameter search tidak boleh kosong');

  const url = `https://api.siputzx.my.id/api/s/gitagram?search=${encodeURIComponent(search)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.data;
  } catch (error) {
    throw new Error(`gitagram scrape gagal: ${error.message}`);
  }
}

module.exports = gitagram;
