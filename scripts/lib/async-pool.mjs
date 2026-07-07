/**
 * Run async work over items with a fixed pool of concurrent workers.
 */
export async function mapPool(items, poolSize, worker) {
  if (items.length === 0) return [];

  const results = new Array(items.length);
  let next = 0;

  async function runWorker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await worker(items[idx], idx);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(poolSize, items.length) }, () => runWorker()),
  );
  return results;
}

/**
 * Serialize async side effects (e.g. status file writes) across concurrent workers.
 */
export function createWriteLock() {
  let chain = Promise.resolve();
  return (fn) => {
    chain = chain.then(fn, fn);
    return chain;
  };
}
