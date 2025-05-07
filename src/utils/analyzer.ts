import { useEffect, useMemo } from "preact/hooks";
import { defer } from "./ui/defer";
import { errorData, type Data, type MaybeData } from "../datatypes";
import type { StateReporter } from "../modules";

// thin wrappers for analyzer modules to handle errors and manage busy state

export const runAnalyzer = async (
  reporter: StateReporter,
  input: MaybeData,
  analyzer: (input: Data) => Promise<MaybeData> | MaybeData,
) => {
  if (!input) {
    return reporter({ output: null });
  }
  if (input.type === "error") {
    return reporter({ output: input });
  }
  reporter({ busy: true });
  await defer(); // wait for the UI to update
  try {
    reporter({ output: await analyzer(input) });
  } catch (e: any) {
    reporter({
      output: errorData("message" in e ? e.message : "Unexpected error."),
    });
  }
};

// Like runAnalyzer but accepts null as input
export const withReporter = async (
  reporter: StateReporter,
  cb: () => Promise<MaybeData> | MaybeData,
) => {
  reporter({ busy: true });
  await defer(); // wait for the UI to update
  try {
    reporter({ output: await cb() });
  } catch (e: any) {
    reporter({
      output: errorData("message" in e ? e.message : "Unexpected error."),
    });
  }
}

export const useAnalyzer = (
  reporter: StateReporter,
  input: MaybeData,
  analyzer: (input: Data) => Promise<MaybeData> | MaybeData,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => analyzer, deps);
  useEffect(() => {
    runAnalyzer(reporter, input, fn);
  }, [fn, reporter, input]);
};
