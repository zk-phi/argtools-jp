import { useEffect, useMemo } from "preact/hooks";
import { defer } from "./defer";
import { textData, type Data } from "../../datatypes";
import type { StateReporter } from "../../modules";

// thin wrappers for analyzer modules to handle errors and manage busy state

export const runAnalyzer = async (
  reporter: StateReporter,
  input: Data | null,
  analyzer: (input: Data) => Promise<Data | null> | Data | null,
) => {
  if (!input) {
    return reporter({ output: null });
  }
  reporter({ busy: true });
  await defer(); // wait for the UI to update
  try {
    reporter({ output: await analyzer(input) });
  } catch (e: any) {
    reporter({
      output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
    });
  }
};

// Like runAnalyzer but accepts null as input
export const withReporter = async (
  reporter: StateReporter,
  cb: () => Promise<Data | null> | Data | null,
) => {
  reporter({ busy: true });
  await defer(); // wait for the UI to update
  try {
    reporter({ output: await cb() });
  } catch (e: any) {
    reporter({
      output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
    });
  }
}

export const useAnalyzer = (
  reporter: StateReporter,
  input: Data | null,
  analyzer: (input: Data) => Promise<Data | null> | Data | null,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => analyzer, deps);
  useEffect(() => {
    runAnalyzer(reporter, input, fn);
  }, [fn, reporter, input]);
};
