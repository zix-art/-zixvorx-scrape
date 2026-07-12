const { fetchResilient } = require('../utils/httpClient');

/**
 * Generate gambar "brat" (teks di atas background polos, gaya cover album Brat - Charli XCX).
 * @param {string} text
 * @returns {Promise<Buffer>} buffer gambar PNG
 */
async function bratMaker(text) {
  if (!text) throw new Error('Parameter text tidak boleh kosong');

  const url = `https://api.theresav.biz.id/maker/brat?text=${encodeURIComponent(text)}`;

  try {
    const response = await fetchResilient(url, {
      headers: { Referer: 'https://api.theresav.biz.id/docs' },
    });
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new Error(`bratMaker scrape gagal: ${error.message}`);
  }
}

module.exports = bratMaker;
