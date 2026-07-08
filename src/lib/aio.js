const { fetchResilient } = require('../utils/httpClient');
const { resolveApiKey } = require('../utils/apiKeyStore');
const { checkDefaultKeyLimit } = require('../utils/defaultKeyLimiter');

/**
 * Downloader all-in-one (tiktok, dll) via theresav.biz.id.
 * @param {string} mediaUrl - link video (misal link TikTok)
 * @param {string} [apiKey] - opsional, override key dari setApiKey('theresav', ...)
 */
async function aio(mediaUrl, apiKey) {
  if (!mediaUrl) throw new Error('Parameter url tidak boleh kosong');

  const { key, isDefault } = resolveApiKey('theresav', apiKey);
  if (isDefault) await checkDefaultKeyLimit('theresav');

  const url = `https://api.theresav.biz.id/download/aio?url=${encodeURIComponent(mediaUrl)}&apikey=${encodeURIComponent(key)}`;

  try {
    const response = await fetchResilient(url);
    const json = await response.json();

    if (!json.status) throw new Error('Response status false dari API');
    return json.result;
  } catch (error) {
    throw new Error(`aio scrape gagal: ${error.message}`);
  }
}

module.exports = aio;
