import type { FunctionComponent } from "preact";
import { fileImporter, type FileImporter, type FileImporterState } from "./fileImporter";
import { textImporter, type TextImporter, type TextImporterState } from "./textImporter";
import type { TargetData } from "../main";

type StateReducer<StateType> = (state: StateType) => StateType;

export type ImporterComponentProps<StateType> = {
  state: StateType,
  updateState: (reducer: StateReducer<StateType>) => void,
};

export type ImporterWithStateType<StateType> = {
  label: string,
  Component: FunctionComponent<ImporterComponentProps<StateType>>
  getInitialState: () => StateType,
};

export type ImporterState = FileImporterState | TextImporterState;
export type Importer = FileImporter | TextImporter;

export const importers: Importer[] = [
  fileImporter,
  textImporter,
];
