import type { FunctionComponent, ComponentChildren } from "preact";
import type { MaybeData, Data } from "../datatypes";

export type StateReporter = (state: { busy?: boolean, output?: MaybeData }) => void;

export type AnalyzerModule = {
  // An user-friendly description.
  label: string,
  // A path to micro-app.
  app?: string,
  // A user-friendly description of the analyzer
  description?: ComponentChildren,
  // Check if the module is applicable to a data, and returns an explanation if true.
  // Note that this procedure should return as fast as possible to avoid input lags.
  detect?: (suspicious: Data) => string | null,
  //    input ... The last output from the previous module.
  // onUpdate ... A function to report output.
  component: FunctionComponent<{ onUpdate: StateReporter, input: MaybeData }>,
};
