import { applyFilter } from "../../../utils/image";
import type { TargetData, TableData, AnalyzerModule, ResultReporter } from "../main";

const detect = (data: TargetData) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "画像に埋め込まれた電子透かしを可視化";
  }
  return null;
};

const instantiate = (id: number, src: TargetData, updateResult: ResultReporter) => {
  (async () => {
    if (src.type !== "binary" || !src.value.mime.startsWith("image")) {
      updateResult(id, { type: "text", value: "ERROR: unexpedted data type." });
      return;
    };
    const blob = URL.createObjectURL(new Blob([src.value.array], { type: src.value.mime }));
    const rImg = await applyFilter(blob, (arr) => {
      for (let i = 0; i < arr.length; i += 4) {
        arr[i + 1] = arr[i + 0];
        arr[i + 2] = arr[i + 0];
        arr[i + 3] = 255;
      }
    });
    const gImg = await applyFilter(blob, (arr) => {
      for (let i = 0; i < arr.length; i += 4) {
        arr[i + 0] = arr[i + 1];
        arr[i + 2] = arr[i + 1];
        arr[i + 3] = 255;
      }
    });
    const bImg = await applyFilter(blob, (arr) => {
      for (let i = 0; i < arr.length; i += 4) {
        arr[i + 0] = arr[i + 2];
        arr[i + 1] = arr[i + 2];
        arr[i + 3] = 255;
      }
    });
    const aImg = await applyFilter(blob, (arr) => {
      for (let i = 0; i < arr.length; i += 4) {
        arr[i + 0] = arr[i + 3];
        arr[i + 1] = arr[i + 3];
        arr[i + 2] = arr[i + 3];
      }
    });
    const lsbImg = await applyFilter(blob, (arr) => {
      for (let i = 0; i < arr.length; i += 1) {
        arr[i] = (arr[i] & 1) * 255;
      }
    });
    const data: TableData = {
      type: "table",
      value: [
        ["R 成分のみ抽出", {
          type: "binary",
          value: { array: new Uint8Array(await rImg.arrayBuffer()), mime: rImg.type },
        }],
        ["G 成分のみ抽出", {
          type: "binary",
          value: { array: new Uint8Array(await gImg.arrayBuffer()), mime: gImg.type },
        }],
        ["B 成分のみ抽出", {
          type: "binary",
          value: { array: new Uint8Array(await bImg.arrayBuffer()), mime: bImg.type },
        }],
        ["透明なピクセルを抽出", {
          type: "binary",
          value: { array: new Uint8Array(await aImg.arrayBuffer()), mime: aImg.type },
        }],
        ["最下位ビットのみ抽出", {
          type: "binary",
          value: { array: new Uint8Array(await lsbImg.arrayBuffer()), mime: lsbImg.type },
        }],
      ],
    };
    updateResult(id, data);
  })();

  return {};
};

export const steganoAnalyzer: AnalyzerModule = {
  label: "画像ステガノグラフィ検査",
  detect,
  instantiate,
};
