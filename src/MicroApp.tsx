import { useState, useCallback } from "preact/hooks";
import { DataViewer } from "./DataViewer";
import type { Data } from "./datatypes"
import type { AnalyzerModule, StateReporter } from "./modules";

export const MicroApp = ({ importer, analyzer, importerLabel }: {
  importer: AnalyzerModule,
  analyzer: AnalyzerModule,
  importerLabel: string,
}) => {
  const [importerOutput, setImporterOutput] = useState<Data | null>(null);
  const [importerBusy, setImporterBusy] = useState(false);

  const onUpdateImporter = useCallback<StateReporter>(state => {
    if (state.output) {
      setImporterOutput(state.output);
    }
    setImporterBusy(!!state.busy);
  }, []);

  const [analyzerOutput, setAnalyzerOutput] = useState<Data | null>(null);
  const [analyzerBusy, setAnalyzerBusy] = useState(false);

  const onUpdateAnalyzer = useCallback<StateReporter>((state) => {
    if (state.output) {
      setAnalyzerOutput(state.output);
    }
    setAnalyzerBusy(!!state.busy);
  }, []);

  const Importer = importer.component;
  const Analyzer = analyzer.component;

  return (
    <>
      {analyzer.description ?? null}
      <hr />
      <h3>{importerLabel}</h3>
      <div style={{ marginBottom: "1em" }}>
        <Importer onUpdate={onUpdateImporter} input={null} />
        <Analyzer onUpdate={onUpdateAnalyzer} input={importerOutput} />
      </div>
      <h3>解析結果</h3>
      {analyzerOutput ? (
        <DataViewer data={analyzerOutput} busy={analyzerBusy || importerBusy} />
      ) : analyzerBusy || importerBusy ? (
        <p>解析中 ...</p>
      ) : (
        null
      )}
    </>
  );
};
