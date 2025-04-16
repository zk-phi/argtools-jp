export type BinaryBody = { array: Uint8Array, mime: string };
export type BinaryData = { type: "binary", value: BinaryBody };
export const binaryData = (array: Uint8Array, mime: string): BinaryData => (
  { type: "binary", value: { array, mime } }
);

export type TextData = { type: "text", value: string };
export const textData = (value: string): TextData => (
  { type: "text", value }
);

export type IntegerData = { type: "integer", value: number };
export const integerData = (value: number): IntegerData => (
  { type: "integer", value }
);

export type IntegersData = { type: "integers", value: number[] };
export const integersData = (value: number[]): IntegersData => (
  { type: "integers", value }
);

export type FloatsData = { type: "floats", value: number[] };
export const floatsData = (value: number[]): FloatsData => (
  { type: "floats", value }
);

export type FloatData = { type: "float", value: number };
export const floatData = (value: number): FloatData => (
  { type: "float", value }
);

export type KeyValueData = { type: "keyvalue", value: [string, Data][] };
export const keyValueData = (value: [string, Data][]): KeyValueData => (
  { type: "keyvalue", value }
);

export type TextTableData = { type: "table/text", value: [string][][] };
export const textTableData = (value: [string][][]): TextTableData => (
  { type: "table/text", value }
);

export type NumberTableData = { type: "table/number", value: [number][][] };
export const numberTableData = (value: [number][][]): NumberTableData => (
  { type: "table/number", value }
);

export type MelodyData = { type: "mml", value: string };
export const melodyData = (value: string): MelodyData => (
  { type: "mml", value }
);

export type Data =
  TextData | BinaryData | IntegerData | IntegersData | FloatsData | FloatData |
  KeyValueData | TextTableData | NumberTableData | MelodyData;
