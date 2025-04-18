// map FN over a range from 0 to N (exclusive)
export const mapRange = <T>(n: number, fn: (i: number) => T): T[] => (
  Array.from({ length: n }, (_: any, i: number) => fn(i))
);

// reduce FN over a range from 0 to N (exclusive)
export const reduceRange = (
  <T>(n: number, fn: (l: T, r: number) => T, init: T): T => (
    Array.from({ length: n }, (_: any, i: number) => i).reduce(fn, init)
  )
);
