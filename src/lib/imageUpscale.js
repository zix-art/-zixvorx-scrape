const { fetchResilient } = require('../utils/httpClient');

const BASE_URL = 'https://get1.imglarger.com/api/UpscalerNew';
const HEADERS = {
  origin: 'https://imgupscaler.com',
  referer: 'https://imgupscaler.com/',
  'user-agent':
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchImageBuffer(url) {
  const response = await fetchResilient(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function upload(buffer, scale) {
  const form = new FormData();
  form.append('myfile', new Blob([buffer]), `${Date.now()}.png`);
  form.append('scaleRadio', String(scale));

  const response = await fetchResilient(`${BASE_URL}/UploadNew`, {
    method: 'POST',
    headers: HEADERS,
    body: form,
  });
  const json = await response.json();
  const code = json?.data?.code;
  if (!code) throw new Error('Upload failed: no code returned');
  return code;
}

async function pollStatus(code, scale, maxAttempts = 40, interval = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(interval);

    const response = await fetchResilient(`${BASE_URL}/CheckStatusNew`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, scaleRadio: scale }),
    });
    const json = await response.json();
    const data = json?.data;
    const status = data?.status;

    if (status === 'success') return data;
    if (status === 'failed' || status === 'error') {
      throw new Error(`Processing failed: ${status}`);
    }
  }

  throw new Error('Timeout: processing took too long');
}

/**
 * Upscale gambar via imgupscaler.com.
 * @param {string} imageUrl
 * @param {number} [scale=2]
 */
async function imageUpscale(imageUrl, scale = 2) {
  if (!imageUrl) throw new Error('Parameter imageUrl tidak boleh kosong');

  try {
    const buffer = await fetchImageBuffer(imageUrl);
    const code = await upload(buffer, scale);
    return await pollStatus(code, scale);
  } catch (error) {
    throw new Error(`imageUpscale scrape gagal: ${error.message}`);
  }
}

module.exports = imageUpscale;
