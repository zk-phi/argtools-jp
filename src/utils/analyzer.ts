import { useEffect, useMemo } from "preact/hooks";
import { errorData, type Data, type MaybeData } from "../datatypes";
import type { StateReporter } from "../modules";

// thin wrappers for analyzer modules to handle errors and manage busy state

export const runAnalyzer = async (
  reporter: StateReporter,
  input: MaybeData,
  analyzer: (input: Data, reporter: StateReporter) => Promise<MaybeData> | MaybeData,
) => {
  if (!input) {
    return reporter({ output: null });
  }
  if (input.type === "error") {
    return reporter({ output: input });
  }
  await reporter({ status: "解析開始" });
  try {
    reporter({ output: await analyzer(input, reporter) });
  } catch (e: any) {
    reporter({
      output: errorData("message" in e ? e.message : "Unexpected error."),
    });
  }
};

// Like runAnalyzer but accepts null as input
export const withReporter = async (
  reporter: StateReporter,
  cb: (reporter: StateReporter) => Promise<MaybeData> | MaybeData,
) => {
  await reporter({ status: "解析開始" });
  try {
    reporter({ output: await cb(reporter) });
  } catch (e: any) {
    reporter({
      output: errorData("message" in e ? e.message : "Unexpected error."),
    });
  }
}

export const useAnalyzer = (
  reporter: StateReporter,
  input: MaybeData,
  analyzer: (input: Data, reporter: StateReporter) => Promise<MaybeData> | MaybeData,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => analyzer, deps);
  useEffect(() => {
    runAnalyzer(reporter, input, fn);
  }, [fn, reporter, input]);
};

export const useReporter = (
  reporter: StateReporter,
  cb: (reporter: StateReporter) => Promise<MaybeData> | MaybeData,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => cb, deps);
  useEffect(() => {
    withReporter(reporter, fn);
  }, [fn, reporter]);
}
