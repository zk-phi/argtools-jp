import { useState, useEffect } from "preact/hooks";
import type { StateReporter } from "../../modules";

// handle busy state locally
export function useDebouncedValue<T> (value: T, ms: number): [T, boolean];
// or use reporter to report busy state globally
export function useDebouncedValue<T> (value: T, ms: number, reporter: StateReporter): T;

export function useDebouncedValue<T> (
  value: T,
  ms: number,
  reporter?: StateReporter
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      if (reporter) {
        reporter({ status: null });
      } else {
        setBusy(false);
      }
    }, ms);
    if (reporter) {
      reporter({ status: "入力待機中" });
    } else {
      setBusy(true);
    }
    return () => clearTimeout(timer);
  }, [value, ms, reporter]);

  if (reporter) {
    return debouncedValue;
  }
  return [debouncedValue, busy];
}
