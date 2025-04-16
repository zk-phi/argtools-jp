import { gensym } from "../../utils/gensym";

export type BinaryBody = { array: Uint8Array, mime: string };
export type BinaryData = { type: "binary", id: number, value: BinaryBody };
export const binaryData = (array: Uint8Array, mime: string): BinaryData => (
  { type: "binary", id: gensym(), value: { array, mime } }
);

export type TextData = { type: "text", id: number, value: string };
export const textData = (value: string): TextData => (
  { type: "text", id: gensym(), value }
);

export type IntegerData = { type: "integer", id: number, value: number };
export const integerData = (value: number): IntegerData => (
  { type: "integer", id: gensym(), value }
);

export type IntegersData = { type: "integers", id: number, value: number[] };
export const integersData = (value: number[]): IntegersData => (
  { type: "integers", id: gensym(), value }
);

export type FloatsData = { type: "floats", id: number, value: number[] };
export const floatsData = (value: number[]): FloatsData => (
  { type: "floats", id: gensym(), value }
);

export type FloatData = { type: "float", id: number, value: number };
export const floatData = (value: number): FloatData => (
  { type: "float", id: gensym(), value }
);

export type KeyValueData = { type: "keyvalue", id: number, value: [string, Data][] };
export const keyValueData = (value: [string, Data][]): KeyValueData => (
  { type: "keyvalue", id: gensym(), value }
);

export type TextTableData = { type: "table/text", id: number, value: [string][][] };
export const textTableData = (value: [string][][]): TextTableData => (
  { type: "table/text", id: gensym(), value }
);

export type NumberTableData = { type: "table/number", id: number, value: [number][][] };
export const numberTableData = (value: [number][][]): NumberTableData => (
  { type: "table/number", id: gensym(), value }
);

export type MelodyData = { type: "mml", id: number, value: string };
export const melodyData = (value: string): MelodyData => (
  { type: "mml", id: gensym(), value }
);

export type Data =
  TextData | BinaryData | IntegerData | IntegersData | FloatsData | FloatData |
  KeyValueData | TextTableData | NumberTableData | MelodyData;
