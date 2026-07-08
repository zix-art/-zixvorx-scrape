const { fetchResilient } = require('../utils/httpClient');

async function githubStalk(username) {
  if (!username) throw new Error('Parameter username tidak boleh kosong');

  const url = `https://api.siputzx.my.id/api/stalk/github?user=${encodeURIComponent(username)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.data;
  } catch (error) {
    throw new Error(`githubStalk scrape gagal: ${error.message}`);
  }
}

module.exports = githubStalk;
