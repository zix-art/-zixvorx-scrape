const { fetchResilient } = require('../utils/httpClient');

async function gdrive(driveUrl) {
  if (!driveUrl) throw new Error('Parameter url Google Drive tidak boleh kosong');

  const url = `https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(driveUrl)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.data;
  } catch (error) {
    throw new Error(`gdrive scrape gagal: ${error.message}`);
  }
}

module.exports = gdrive;
