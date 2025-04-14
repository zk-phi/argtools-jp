import { render, } from "preact";
import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { datasets, datasetKeys, getDataset, type Dataset } from "../../datasets";
import { useDebounce } from "../../utils/useDebounce";
import { gensym } from "../../utils/gensym";

type Filter = { type: string, string: string, length: number, id: number };

const applyFilter = (dataset: Dataset, filter: Filter) => (
  dataset.filter(row => {
    switch (filter.type) {
      case "exact": return row.key === filter.string;
      case "prefix": return row.key.startsWith(filter.string);
      case "suffix": return row.key.endsWith(filter.string);
      case "infix": return row.key.includes(filter.string);
      case "regex": return !!row.key.match(filter.string);
      case "minLength": return row.key.length >= filter.length;
      case "maxLength": return row.key.length <= filter.length;
      case "exactLength": return row.key.length === filter.length;
      case "description": return row.value.includes(filter.string);
      default: return false;
    }
  })
);

const App = () => {
  const [datasetKey, setDatasetKey] = useState<string>("");

  const [dataset, setDataset] = useState<Dataset | null>(null);
  useEffect(() => {
    getDataset(datasetKey).then(data => setDataset(data));
  }, [datasetKey]);

  const [filters, setFilters] = useState<Filter[]>([]);
  const debouncedFilters = useDebounce(filters, 300);

  const filteredDataset = useMemo(() => (
    dataset && debouncedFilters.reduce((l, r) => applyFilter(l, r), dataset)
  ), [dataset, debouncedFilters])

  const selectDataset = useCallback((key: string) => {
    setDataset(null);
    setDatasetKey(key);
  }, []);

  const addFilter = useCallback(() => {
    setFilters([...filters, { type: "infix", string: "", length: 1, id: gensym() }]);
  }, [filters]);

  const selectFilterType = useCallback((ix: number, type: string) => {
    setFilters([
      ...filters.slice(0, ix),
      { ...filters[ix], type: type },
      ...filters.slice(ix + 1),
    ]);
  }, [filters])

  const inputFilterString = useCallback((ix: number, string: string) => {
    setFilters([
      ...filters.slice(0, ix),
      { ...filters[ix], string: string },
      ...filters.slice(ix + 1),
    ]);
  }, [filters]);

  const inputFilterLength = useCallback((ix: number, length: string) => {
    const numberLength = Number(length);
    setFilters([
      ...filters.slice(0, ix),
      { ...filters[ix], length: numberLength },
      ...filters.slice(ix + 1),
    ]);
  }, [filters]);

  return (
    <>
      <h2>Anything - 森羅万象検索</h2>
      <p>
        各種オープンデータから複雑な絞り込み検索を行えます。
      </p>
      <h3>データセット</h3>
      <select value={datasetKey} onChange={e => selectDataset(e.currentTarget.value)}>
        <option value="" />
        {datasetKeys.map(key => (
          <option key={key} value={key}>{datasets[key].label}</option>
        ))}
      </select>
      {datasetKey && (
        <>
          <p>
            ソース：
            <a href={datasets[datasetKey]?.url} target="_blank" rel="noreferrer">
              {datasets[datasetKey]?.url}
            </a>
          </p>
          <p>
            ※加工・再配布等の際は、上記 URL の利用条件を参照してください。
          </p>
        </>
      )}
      <h3>フィルタ</h3>
      <div>
        <button type="button" onClick={addFilter}>＋条件を追加</button>
      </div>
      {filters.map((filter, ix) => (
        <fieldset key={filter.id}>
          <legend>条件 {ix + 1}</legend>
          <div>
            <label for="type">タイプ：</label>
            <select
                name="type"
                value={filter.type}
                onChange={e => selectFilterType(ix, e.currentTarget.value)}>
              <option value="infix">〜を含む</option>
              <option value="prefix">〜で始まる</option>
              <option value="suffix">〜で終わる</option>
              <option value="regex">〜にマッチ（正規表現）</option>
              <option value="exact">〜に一致</option>
              <option value="minLength">〜文字以上</option>
              <option value="maxLength">〜文字以下</option>
              <option value="exactLength">〜文字ジャスト</option>
              <option value="description">補足情報が〜を含む</option>
            </select>
          </div>
          {!filter.type.endsWith("Length") && (
            <div>
              <label for="string">キーワード：</label>
              <input
                  type="text"
                  name="string"
                  value={filter.string}
                  onInput={e => inputFilterString(ix, e.currentTarget.value)}
              />
            </div>
          )}
          {filter.type.endsWith("Length") && (
            <div>
              <label for="length">文字数：</label>
              <input
                  type="number"
                  name="length"
                  step="1"
                  min="0"
                  value={filter.length}
                  onInput={e => inputFilterLength(ix, e.currentTarget.value)}
              />
            </div>
          )}
        </fieldset>
      ))}
      <h3>検索結果</h3>
      <hr />
      { !filteredDataset ? "読み込み中..." : !filteredDataset[0] ? "データなし" : (
        <table>
          <tbody>
            { filteredDataset.map(row => (
              <tr key={row.id}>
                <td>{row.key}</td>
                <td>{row.value}</td>
              </tr>
            )) }
          </tbody>
        </table>
      ) }
    </>
  );
};

const div = document.getElementById("app")!;
render(<App />, div)
