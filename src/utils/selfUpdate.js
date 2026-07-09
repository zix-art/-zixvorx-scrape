const { fetchResilient } = require('./httpClient');
const pkg = require('../../package.json');

const REGISTRY_URL = `https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/latest`;

/**
 * Cek versi terbaru yang published di npm registry.
 * Cuma ngecek, gak install/ubah apapun.
 * Gagal (misal offline) dianggap non-kritis, bukan error yang dilempar.
 */
async function checkForUpdates() {
  try {
    const response = await fetchResilient(REGISTRY_URL);
    const data = await response.json();
    const latest = data.version;
    const current = pkg.version;

    return { current, latest, hasUpdate: Boolean(latest) && latest !== current };
  } catch (error) {
    return { current: pkg.version, latest: null, hasUpdate: false, error: error.message };
  }
}

/**
 * Jalankan `npm install <pkg>@latest`. HANYA jalan kalau dipanggil eksplisit
 * oleh user (lewat kode atau CLI --self-update) — bukan otomatis di background,
 * karena auto-install diam-diam adalah anti-pattern keamanan.
 */
function selfUpdate() {
  const { execSync } = require('child_process');
  console.log(`Menjalankan: npm install ${pkg.name}@latest ...`);

  try {
    execSync(`npm install ${pkg.name}@latest`, { stdio: 'inherit' });
    console.log('Selesai.');
  } catch (error) {
    console.error(
      `\nGagal update. Kemungkinan versi terbaru belum ke-propagate penuh di npm registry ` +
        `Coba lagi dalam 1-2 menit, atau cek manual: npm view ${pkg.name} versions\n`
    );
    process.exitCode = 1;
  }
}

module.exports = { checkForUpdates, selfUpdate };
