type Importer<T> = () => Promise<T>;
export const dynamicPackage = async <T>(importer: Importer<T>): Promise<T> => {
  let cache: T | null = null;
  if (!cache) {
    cache =  await importer();
  }
  return Promise.resolve(cache);
};
