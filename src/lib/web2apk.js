const { fetchResilient } = require('../utils/httpClient');

const API_URL = 'https://webappcreator.amethystlab.org/api/build-apk';
const BASE_URL = 'https://webappcreator.amethystlab.org';

function isValidUrl(url) {
  return /^https?:\/\//i.test(url);
}

function buildPackageName(appName) {
  const cleaned = appName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `com.${cleaned || 'app'}.web2apk`;
}

/**
 * Ubah website jadi APK via webappcreator.amethystlab.org.
 * @param {string} url - URL website yang mau dijadiin APK
 * @param {string} appName - nama aplikasi
 * @param {Buffer} iconBuffer - buffer icon PNG
 * @param {object} [options]
 * @param {string} [options.versionName='1.0.0']
 * @param {number} [options.versionCode=1]
 */
async function web2apk(url, appName, iconBuffer, options = {}) {
  if (!isValidUrl(url)) throw new Error('URL harus diawali dengan http:// atau https://');
  if (!appName) throw new Error('Nama aplikasi tidak boleh kosong');
  if (!iconBuffer) throw new Error('Icon aplikasi wajib disertakan (Buffer)');

  const { versionName = '1.0.0', versionCode = 1 } = options;
  const packageName = buildPackageName(appName);

  const form = new FormData();
  form.append('websiteUrl', url);
  form.append('appName', appName);
  form.append('icon', new Blob([iconBuffer]), 'icon.png');
  form.append('packageName', packageName);
  form.append('versionName', versionName);
  form.append('versionCode', String(versionCode));

  try {
    const response = await fetchResilient(API_URL, {
      method: 'POST',
      headers: {
        Origin: BASE_URL,
        Referer: `${BASE_URL}/`,
      },
      body: form,
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Gagal mem-build APK dari server');

    return {
      appName,
      packageName,
      downloadUrl: `${BASE_URL}${data.downloadUrl}`,
    };
  } catch (error) {
    throw new Error(`web2apk scrape gagal: ${error.message}`);
  }
}

module.exports = web2apk;
