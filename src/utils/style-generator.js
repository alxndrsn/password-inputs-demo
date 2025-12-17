import { cloneDeep } from 'lodash';

export const generateStyleGetter = (base, generators) => {
  if(generators === undefined) {
    generators = base;
    base = {};
  }

  const cache = new Map();

  const keys = Object.keys(generators);
  const lastKey = keys.pop();

  function generateFor(opts) {
    let obj = cloneDeep(base);
    for(const k of [...keys, lastKey]) {
      const g = generators[k];
      const v = opts[k];
      obj = { ...obj, ...(typeof g === 'function' ? g(v) : (v&&g)) };
    }
    return obj;
  }

  return opts => {
    const cacheKey = k => {
      const cacheK = typeof generators[k] === 'function' ? opts[k] : !!opts[k];
      if(cacheK === null) return cacheK;

      const t = typeof cacheK;
      if(t === 'function' || t === 'object') {
        console.warn(`Abnormal cache key type provided: '${t}'; converting to boolean.`); // eslint-disable-line no-console
        return !!cacheK;
      }

      return cacheK;
    };

    let curr = cache;

    for(const k of keys) {
      const cacheK = cacheKey(k);
      if(!curr.has(cacheK)) curr.set(cacheK, new Map());
      curr = curr.get(cacheK);
    }
    const cacheK = cacheKey(lastKey);
    if(!curr.has(cacheK)) curr.set(cacheK, generateFor(opts));

    return curr.get(cacheK);
  };
};
