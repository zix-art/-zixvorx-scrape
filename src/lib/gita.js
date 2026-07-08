const { fetchResilient } = require('../utils/httpClient');

async function gita(q) {
  if (!q) throw new Error('Parameter q (pertanyaan) tidak boleh kosong');

  const url = `https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(q)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.data;
  } catch (error) {
    throw new Error(`gita scrape gagal: ${error.message}`);
  }
}

module.exports = gita;
