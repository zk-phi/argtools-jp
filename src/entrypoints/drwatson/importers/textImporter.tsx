import { useCallback, useEffect } from "preact/hooks";
import type { TextData, AbstractState } from "../main";
import type { ImporterWithStateType, ImporterComponentProps } from ".";

export interface TextImporterState extends AbstractState {
  tag: "textImporter",
  result: TextData,
}

export type TextImporter = ImporterWithStateType<TextImporterState>;

const TextImporter = (
  { state, updateState }: ImporterComponentProps<TextImporterState>
) => {
  const onInput = useCallback((value: string) => {
    const result: TextData = { type: "text", value };
    updateState(state => ({ ...state, result }));
  }, [updateState]);

  return (
    <section>
      <h5>文字列を解読</h5>
      <input
          type="text"
          onInput={e => onInput(e.currentTarget.value)}
          value={state.result.value}
      />
    </section>
  );
};

export const textImporter: TextImporter = {
  label: "文字列を解読",
  Component: TextImporter,
  getInitialState: () => ({
    tag: "textImporter",
    result: { type: "text", value: "" },
  }),
};
