const { fetchResilient } = require('../utils/httpClient');
const { resolveApiKey } = require('../utils/apiKeyStore');
const { checkDefaultKeyLimit } = require('../utils/defaultKeyLimiter');

/**
 * Download video YouTube ke MP4 via theresav.biz.id.
 * @param {string} videoUrl - link video YouTube
 * @param {string|number} [resolution=360] - resolusi video, misal 360/480/720
 * @param {string} [apiKey] - opsional, override key dari setApiKey('theresav', ...)
 */
async function ytmp4(videoUrl, resolution = 360, apiKey) {
  if (!videoUrl) throw new Error('Parameter url tidak boleh kosong');

  const { key, isDefault } = resolveApiKey('theresav', apiKey);
  if (isDefault) await checkDefaultKeyLimit('theresav');

  const url = `https://api.theresav.biz.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}&resolution=${encodeURIComponent(resolution)}&apikey=${encodeURIComponent(key)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');

    const { status, creator, ...data } = json;
    return data;
  } catch (error) {
    throw new Error(`ytmp4 scrape gagal: ${error.message}`);
  }
}

module.exports = ytmp4;
