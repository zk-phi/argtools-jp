// map FN over a range from 0 to N (exclusive)
export const mapRange = <T>(n: number, fn: (i: number) => T): T[] => (
  Array.from({ length: n }, (_: any, i: number) => fn(i))
);
