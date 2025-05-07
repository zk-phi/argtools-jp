import { useEffect, useMemo } from "preact/hooks";
import { defer } from "./defer";
import { textData, type Data } from "../../datatypes";
import type { StateReporter } from "../../module";

// thin wrapper for analyzer modules to handle errors and manage state
export const useAnalyzerEffect = (
  reporter: StateReporter,
  cb: () => Data | null,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => cb, deps);
  useEffect(() => {
    reporter({ busy: true });
    defer(() => {
      try {
        reporter({ output: fn() });
      } catch (e: any) {
        reporter({
          output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
        });
      }
    });
  }, [reporter, fn]);
};

// thin wrapper for analyzer modules to handle errors and state management
export const useAsyncAnalyzerEffect = (
  reporter: StateReporter,
  cb: () => Promise<Data | null>,
  deps: any[],
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const fn = useMemo(() => cb, deps);
  useEffect(() => {
    reporter({ busy: true });
    defer(async () => {
      try {
        reporter({ output: await fn() });
      } catch (e: any) {
        reporter({
          output: textData("message" in e ? e.message : "Unexpected error.", "エラー"),
        });
      }
    });
  }, [reporter, fn]);
};
