import { reverseSpectrogram } from "./image/reverseSpectrogram";

import type { AnalyzerModule } from "../";

export const encoders: AnalyzerModule[] = [
  reverseSpectrogram,
];
