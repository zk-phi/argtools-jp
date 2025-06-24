declare module "*.csv" {
  const _default: Array<{ [key: string]: string }>
  export default _default;
}

declare module "*?raw" {
  const _default: string;
  export default _default;
}

declare module "*?url" {
  const _default: string;
  export default _default;
}

declare module "quagga" {
  const _default: {
    decodeSingle: (
      args: any,
      cb: (res: { codeResult?: { code: string } }) => void,
    ) => void,
  };
  export default _default;
}
