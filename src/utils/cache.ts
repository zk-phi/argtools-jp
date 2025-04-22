export const cache = <T>(fn: () => T) => (
  (): T => {
    let cache: T | null = null;
    if (!cache) {
      cache = fn();
    }
    return cache;
  }
)

export const cacheAsync = <T>(fn: () => Promise<T>) => (
  async (): Promise<T> => {
    let cache: T | null = null;
    if (!cache) {
      cache =  await fn();
    }
    return Promise.resolve(cache);
  }
);
