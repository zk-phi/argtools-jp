import { useEffect, useMemo } from "preact/hooks";
import { defer } from "./defer";
import { textData, type Data } from "../../datatypes";
import type { StateReporter } from "../../modules";

// thin wrappers for analyzer modules to handle errors and manage busy state

export const withReporter = (
  reporter: StateReporter,
  cb: () => Data | null,
) => {
  reporter({ busy: true });
  // wait for the UI to update
  defer(() => {
    try {
      reporter({ output: cb() });
    } catch (e: any) {
      reporter({
        output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
      });
    }
  });
};

export const withReporterAsync = (
  reporter: StateReporter,
  cb: () => Promise<Data | null>,
) => {
  reporter({ busy: true });
  defer(async () => {
    try {
      reporter({ output: await cb() });
    } catch (e: any) {
      reporter({
        output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
      });
    }
  });
};

export const useAnalyzerEffect = (
  reporter: StateReporter,
  cb: () => Data | null,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => cb, deps);
  useEffect(() => withReporter(reporter, fn), [reporter, fn]);
};

export const useAsyncAnalyzerEffect = (
  reporter: StateReporter,
  cb: () => Promise<Data | null>,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => cb, deps);
  useEffect(() => withReporterAsync(reporter, fn), [reporter, fn]);
};
