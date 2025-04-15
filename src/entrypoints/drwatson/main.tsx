import { render } from "preact";
import { useState, useCallback } from "preact/hooks";
import { importers, Importer, ImporterState } from "./importers";

export type BinaryBody = { buffer: ArrayBuffer, label: string, mime: string | null };
export type TextData = { type: "text", value: string };
export type TextsData = { type: "texts", value: string[] };
export type BinaryData = { type: "binary", value: BinaryBody };
export type BinariesData = { type: "binaries", value: BinaryBody[] };
export type IntegerData = { type: "integer", value: number };
export type IntegersData = { type: "integers", value: number[] };
export type FloatsData = { type: "floats", value: number[] };
export type FloatData = { type: "float", value: number };

export type TargetData =
  TextData | TextsData | BinaryData | BinariesData |
  IntegerData | IntegersData | FloatsData | FloatData;

export interface AbstractState {
  tag: string,
  result: TargetData | null,
}

type State = ImporterState;

const App = () => {
  const [stack, setStack] = useState<State[]>([]);

  if (stack.length === 0) {
    return (
      <>
        <h3>解析対象を選ぶ</h3>
        {importers.map(importer => (
          <button type="button" onClick={() => setStack([importer.getInitialState()])}>
            {importer.label}
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      Hello!
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
