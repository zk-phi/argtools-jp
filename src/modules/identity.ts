import { useEffect } from "preact/hooks";
import type { MaybeData } from "../datatypes";
import type { AnalyzerModule, StateReporter } from "../modules";

// An identity analyzer that does nothing.
export const identity: AnalyzerModule = {
  label: "解析結果",
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
    useEffect(() => {
      onUpdate({ output: input });
    }, [onUpdate, input]);
    return null;
  },
};
