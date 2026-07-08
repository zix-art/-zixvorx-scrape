const { fetchResilient } = require('../utils/httpClient');
const { resolveApiKey } = require('../utils/apiKeyStore');
const { checkDefaultKeyLimit } = require('../utils/defaultKeyLimiter');

/**
 * Download audio YouTube ke MP3 via theresav.biz.id.
 * @param {string} videoUrl - link video YouTube
 * @param {object} [options]
 * @param {string} [options.format='mp3']
 * @param {string} [options.bitrate='128k']
 * @param {string} [apiKey] - opsional, override key dari setApiKey('theresav', ...)
 */
async function ytmp3(videoUrl, options = {}, apiKey) {
  if (!videoUrl) throw new Error('Parameter url tidak boleh kosong');

  const { format = 'mp3', bitrate = '128k' } = options;
  const { key, isDefault } = resolveApiKey('theresav', apiKey);
  if (isDefault) await checkDefaultKeyLimit('theresav');

  const url = `https://api.theresav.biz.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}&format=${encodeURIComponent(format)}&bitrate=${encodeURIComponent(bitrate)}&apikey=${encodeURIComponent(key)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');

    const { status, creator, ...data } = json;
    return data;
  } catch (error) {
    throw new Error(`ytmp3 scrape gagal: ${error.message}`);
  }
}

module.exports = ytmp3;
