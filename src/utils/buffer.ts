export const duplicate = (buf: ArrayBufferLike): ArrayBuffer => {
  const duplicated = new ArrayBuffer(buf.byteLength);
  (new Uint8Array(duplicated)).set(new Uint8Array(buf), 0);
  return duplicated;
}
