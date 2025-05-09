export const clamp = (x: number, l: number, r: number) => Math.max(l, Math.min(r, x));
export const norm = (x: number, y: number) => Math.sqrt(x * x + y * y);

export const roundUpToPowerOf2 = (n: number) => (
  2 ** Math.ceil(Math.log(n) / Math.log(2))
);

export const roundDownToPowerOf2 = (n: number) => (
  2 ** Math.floor(Math.log(n) / Math.log(2))
);

// linear interpolation
//
// l      x   r
// .------.---.
//
// l, r ... values
// x ... position [0.0-1.0]
export const lerp1D = (l: number, r: number, x: number) => l + (r - l) * x;

// bilinear interpolation
//
// lt    x  rt
//  .----.--.
//  |    .... y
//  |       |
//  .-------.
// lb       rb
//
// lt, rt, lb, rb ... values
// x, y ... position [0.0-1.0]
export const learp2D =
  (lt: number, rt: number, lb: number, rb: number, x: number, y: number): number => {
    const top = lerp1D(lt, rt, x);
    const bottom = lerp1D(lb, rb, x);
    return lerp1D(top, bottom, y);
  };

// NOTE: Both MIN and MAX are INCLUSIVE here.
type IndexRange = { min: number, max: number };

// Remap a linear array of values, by applying linear interpolation.
export const remap1D = (arr: ArrayLike<number>, from: IndexRange, to: IndexRange) => {
  if (from.min < 0 || from.max < 0 || from.min >= arr.length || from.max >= arr.length) {
    throw new Error("remap1D: Range error.");
  }
  const scaleFactor = (from.max - from.min) / (to.max - to.min);
  const getRescaledIx = (ix: number) => (ix - to.min) * scaleFactor + from.min;
  return (x: number): number => {
    // Due to floating number precision issue,
    // rescaled index can be out of range like "-0.00000001",
    // even if FROM and TO are correctly selected.
    // So we need to clamp here.
    const rescaledIx = clamp(getRescaledIx(x), 0, arr.length);
    if (Number.isInteger(rescaledIx)) {
      return arr[rescaledIx];
    }
    const ixFloor = Math.floor(rescaledIx);
    return lerp1D(arr[ixFloor], arr[ixFloor + 1], rescaledIx - ixFloor);
  };
};
