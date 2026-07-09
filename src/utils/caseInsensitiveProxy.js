/**
 * Bungkus object dengan Proxy biar property access-nya case-insensitive.
 * Exact match tetap diprioritaskan kalau kebetulan ada; fallback ke
 * pencarian case-insensitive kalau exact match gak ketemu.
 * @param {object} target
 */
function makeCaseInsensitive(target) {
  const keyMap = new Map();
  Object.keys(target).forEach((key) => keyMap.set(key.toLowerCase(), key));

  return new Proxy(target, {
    get(obj, prop, receiver) {
      if (typeof prop !== 'string') return Reflect.get(obj, prop, receiver);
      if (prop in obj) return Reflect.get(obj, prop, receiver);

      const realKey = keyMap.get(prop.toLowerCase());
      return realKey ? Reflect.get(obj, realKey, receiver) : undefined;
    },
    has(obj, prop) {
      if (typeof prop !== 'string') return Reflect.has(obj, prop);
      return Reflect.has(obj, prop) || keyMap.has(prop.toLowerCase());
    },
  });
}

module.exports = { makeCaseInsensitive };
