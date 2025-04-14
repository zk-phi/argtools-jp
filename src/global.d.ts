declare module "*.csv" {
  const _default: Array<{ [key: string]: string }>
  export default _default;
}

declare module "*?raw" {
  const _default: string;
  export default _default;
}
