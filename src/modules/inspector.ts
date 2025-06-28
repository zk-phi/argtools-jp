import { useAnalyzer } from "../utils/analyzer";
import type { Data, MaybeData } from "../datatypes";
import type { AnalyzerModule, StateReporter } from "../modules";

// A higher-order module to extract an element from a MultipleData.
export const genInspector = (ix: number): AnalyzerModule => ({
  label: "この項目を精査",
  component: ({ onUpdate, input }: { onUpdate: StateReporter, input: MaybeData }) => {
    useAnalyzer(onUpdate, input, (input: Data) => {
      if (!input || input.type !== "multiple" || !input.datum[ix]) {
        throw new Error("精査の対象が見つかりません");
      }
      return input.datum[ix];
    }, [ix]);
    return null;
  },
})
