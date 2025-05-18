const ENCODINGS = ["utf-8", "shift-jis", "euc-jp"];

export const decode = (array: Uint8Array): string => {
  for (const encoding of ENCODINGS) {
    try {
      const decoder = new TextDecoder(encoding, { fatal: true });
      return decoder.decode(array);
    } catch (_) {
      // fall through to the next decoder
    }
  }
  throw new Error("Cannot decode array.");
}
