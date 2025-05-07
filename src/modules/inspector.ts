import { useEffect } from "preact/hooks";
import { textData, type Data } from "../datatypes";
import type { AnalyzerModule, StateReporter } from "../modules";

// A higher-order module to extract an element from a MultipleData.
export const genInspector = (ix: number): AnalyzerModule => ({
  label: "この項目を精査",
  detect: () => null,
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: Data | null }) => {
    useEffect(() => {
      if (!input || input.type !== "multiple" || !input.datum[ix]) {
        onUpdate({ output: textData("UNEXPECTED: no inspection target.", "エラー") });
      } else {
        onUpdate({ output: input.datum[ix] });
      }
    }, [onUpdate, ix, input]);
    return null;
  },
})
