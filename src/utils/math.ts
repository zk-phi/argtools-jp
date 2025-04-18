export const clamp = (l: number, r: number, x: number) => Math.max(l, Math.min(r, x));
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
export const lerp = (l: number, r: number, x: number) => l + (r - l) * x;

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
export const bilinear =
  (lt: number, rt: number, lb: number, rb: number, x: number, y: number): number => {
    const top = lerp(lt, rt, x);
    const bottom = lerp(lb, rb, x);
    return lerp(top, bottom, y);
  };

type IndexRange = { min: number, max: number };
// rescale a linear map of values by applying linear interpolation
// note that ranges are inclusive here
export const rescaleValueMap1D = (from: IndexRange, to: IndexRange) => {
  const scaleFactor = (to.max - to.min) / (from.max - from.min);
  return <T extends number>(arr: ArrayLike<T>, ix: number) => {
    const rescaledIx = to.min + (ix - from.min) * scaleFactor;
    if (rescaledIx < 0 || rescaledIx >= arr.length) {
      throw new Error("rescaleValueMap1D: Range error");
    }
    if (Number.isInteger(rescaledIx)) {
      return arr[rescaledIx];
    }
    const ixFloor = Math.floor(rescaledIx);
    return lerp(arr[ixFloor], arr[ixFloor + 1], rescaledIx - ixFloor);
  }};
