import { useState, useMemo, useCallback } from "preact/hooks";
import { useDebouncedValue } from "../utils/ui/debounce";
import { gensym } from "../utils/gensym";
import { save } from "../utils/file/save";
import type { Wordlist } from "../datatypes";

type Filter = { type: string, string: string, length: number, id: number };

const applyFilter = (value: Wordlist, filter: Filter) => (
  value.filter(row => {
    switch (filter.type) {
      case "exact": return row.key === filter.string;
      case "prefix": return row.key.startsWith(filter.string);
      case "suffix": return row.key.endsWith(filter.string);
      case "infix": return row.key.includes(filter.string);
      case "regex":
        try {
          return !!row.key.match(filter.string);
        } catch {
          return false;
        }
      case "minLength": return row.key.length >= filter.length;
      case "maxLength": return row.key.length <= filter.length;
      case "exactLength": return row.key.length === filter.length;
      case "description": return row.value.includes(filter.string);
      default: return false;
    }
  })
);

const saveAsTsv = (wordlist: Wordlist) => {
  const tsv = wordlist.map((row) => (
    `${row.key.replaceAll("\t", " ")}\t${row.value.replaceAll("\t", " ")}`
  )).join("\n");
  const blob = new Blob([`${tsv}\n`], { type: "text/tab-separated-values" });
  save(blob, ".tsv");
};

const busyOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "#0004",
  boxSizing: "border-box",
};

export const WordlistViewer = ({ value, status }: { value: Wordlist, status?: string | null }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [debouncedFilters, filterBusy] = useDebouncedValue(filters, 300);

  const filteredWords = useMemo(() => (
    debouncedFilters.reduce((l, r) => applyFilter(l, r), value)
  ), [value, debouncedFilters]);

  const addFilter = useCallback(() => {
    setFilters([...filters, { type: "infix", string: "", length: 1, id: gensym() }]);
  }, [filters]);

  const removeFilter = useCallback((ix: number) => {
    setFilters(filters.filter((_, i: number) => i !== ix))
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

  const statusMessage = status || (filterBusy ? "検索しています" : null);

  return (
    <>
      <h4>絞り込み</h4>
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
          <div>
            <button type="button" onClick={() => removeFilter(ix)}>− 条件を削除</button>
          </div>
        </fieldset>
      ))}
      <p>
        <button type="button" onClick={addFilter}>＋ 条件を追加</button>
      </p>
      <h4>検索結果</h4>
      {!filteredWords?.[0] ? (
        <p>{statusMessage ? `${statusMessage} ...` : "データなし"}</p>
      ) : (
        <>
          {statusMessage ? (
            <p>{statusMessage}</p>
          ) : (
            <p>
              {`${filteredWords.length} 件 `}
              <a href="javascript: void(0)" onClick={() => saveAsTsv(filteredWords)}>保存</a>
            </p>
          )}
        <div style={{ position: "relative" }}>
          <table>
            <tbody>
              {filteredWords.slice(0, 300).map(row => (
                <tr key={row.id}>
                  <td>{row.key}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredWords.length > 300 && (
            <p>... 先頭の 300 件を表示中</p>
          )}
          {statusMessage && <div style={busyOverlayStyle} />}
        </div>
    </>
      )}
    </>
  );
}
