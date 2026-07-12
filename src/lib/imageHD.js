const { fetchResilient } = require('../utils/httpClient');
const { resolveApiKey } = require('../utils/apiKeyStore');
const { checkDefaultKeyLimit } = require('../utils/defaultKeyLimiter');

/**
 * Upscale/HD-in gambar via theresav.biz.id.
 * NOTE: curl contoh dari API ini gak nunjukin field form data buat gambar,
 * jadi diasumsikan body POST-nya raw binary. Kalau ternyata API-nya
 * butuh multipart/form-data dengan field name tertentu, sesuaikan bagian body.
 * @param {string|Buffer} image - URL gambar atau Buffer gambar langsung
 * @param {number} [scale=2]
 * @param {string} [apiKey] - opsional, override key dari setApiKey('theresav', ...)
 * @returns {Promise<Buffer>} buffer gambar hasil HD
 */
async function imageHD(image, scale = 2, apiKey) {
  if (!image) throw new Error('Parameter image (url atau Buffer) tidak boleh kosong');

  const { key, isDefault } = resolveApiKey('theresav', apiKey);
  if (isDefault) await checkDefaultKeyLimit('theresav');

  try {
    let imageBuffer;
    if (Buffer.isBuffer(image)) {
      imageBuffer = image;
    } else {
      const imgRes = await fetchResilient(image);
      const arrayBuffer = await imgRes.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const url = `https://api.theresav.biz.id/tools/hd?scale=${encodeURIComponent(scale)}&apikey=${encodeURIComponent(key)}`;

    const response = await fetchResilient(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        Referer: 'https://api.theresav.biz.id/docs',
      },
      body: imageBuffer,
    });

    const resultBuffer = await response.arrayBuffer();
    return Buffer.from(resultBuffer);
  } catch (error) {
    throw new Error(`imageHD scrape gagal: ${error.message}`);
  }
}

module.exports = imageHD;
