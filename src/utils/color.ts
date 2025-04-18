import { clamp } from "./math";

const _reduceColorVec = (x: number, arr: number[]) => (
  arr.reduce((l, r) => l * x + r)
);

// inferno colormap https://www.shadertoy.com/view/WlfXRN (CC0)
// input: 0.0-1.0, output: [0.0-1.0, 0.0-1.0, 0.0-1.0,]
export const infernoColorMap = (x: number): [number, number, number] => {
  const r = [
    25.13112622477341,
    -71.31942824499214,
    77.162935699427,
    -41.70399613139459,
    11.60249308247187,
    0.1065134194856116,
    0.0002189403691192265,
  ];

  const g = [
    -12.24266895238567,
    32.62606426397723,
    -33.40235894210092,
    17.43639888205313,
    -3.972853965665698,
    0.5639564367884091,
    0.001651004631001012,
  ];

  const b = [
    -23.07032500287172,
    73.20951985803202,
    -81.80730925738993,
    44.35414519872813,
    -15.9423941062914,
    3.932712388889277,
    -0.01948089843709184,
  ];

  return [
    clamp(0, 1, _reduceColorVec(x, r)),
    clamp(0, 1, _reduceColorVec(x, g)),
    clamp(0, 1, _reduceColorVec(x, b)),
  ];
}
