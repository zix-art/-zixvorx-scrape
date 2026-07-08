const keys = {};

// API key default bawaan package, dipakai bareng semua user kalau
// mereka gak setApiKey sendiri. Dibatasi via defaultKeyLimiter.
const DEFAULT_KEYS = {
  theresav: 'JGxNW',
};

/**
 * Simpan API key untuk provider tertentu, dipakai otomatis oleh semua
 * scraper yang butuh key dari provider tersebut. Meng-override default key.
 * @param {string} provider - nama provider, misal 'theresav'
 * @param {string} key
 */
function setApiKey(provider, key) {
  if (!provider) throw new Error('Nama provider wajib diisi');
  if (!key) throw new Error('API key wajib diisi');
  keys[provider] = key;
}

/**
 * Ambil API key yang tersimpan (bukan default) untuk provider tertentu.
 * @param {string} provider
 * @returns {string|undefined}
 */
function getApiKey(provider) {
  return keys[provider];
}

/**
 * Resolve key yang harus dipakai dari: argumen eksplisit > key hasil setApiKey > default bawaan.
 * @param {string} provider
 * @param {string} [explicitKey]
 * @returns {{ key: string, isDefault: boolean }}
 */
function resolveApiKey(provider, explicitKey) {
  if (explicitKey) return { key: explicitKey, isDefault: false };

  const userKey = getApiKey(provider);
  if (userKey) return { key: userKey, isDefault: false };

  const defaultKey = DEFAULT_KEYS[provider];
  if (defaultKey) return { key: defaultKey, isDefault: true };

  throw new Error(
    `API key untuk '${provider}' belum di-set dan gak ada default. Panggil setApiKey('${provider}', 'KEY_KAMU').`
  );
}

module.exports = { setApiKey, getApiKey, resolveApiKey, DEFAULT_KEYS };
