import { useState, useEffect, useRef, useCallback } from "preact/hooks";

type Timeout = ReturnType<typeof setTimeout>

export const useDebouncer = (ms: number) => {
  const timeoutRef = useRef<Timeout | null>(null);

  const callback = useCallback((fn: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(fn, ms);
  }, [ms]);

  return callback;
};

export const useDebouncedValue = <T>(value: T, ms: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);

  return debouncedValue;
};
