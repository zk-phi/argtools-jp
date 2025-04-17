import { keyValueData, binaryData, textData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "画像に埋め込まれた電子透かしを可視化";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("image")) {
    return { initialResult: textData("UNEXPECTED: not an image.") };
  };

  (async () => {
    const { applyFilter } = await import("../../../../utils/image.ts");
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
    const data = keyValueData([
      ["R 成分のみ抽出", binaryData(new Uint8Array(await rImg.arrayBuffer()), rImg.type)],
      ["G 成分のみ抽出", binaryData(new Uint8Array(await gImg.arrayBuffer()), gImg.type )],
      ["B 成分のみ抽出", binaryData(new Uint8Array(await bImg.arrayBuffer()), bImg.type )],
      ["透明ピクセルを抽出", binaryData(new Uint8Array(await aImg.arrayBuffer()), aImg.type )],
      ["最下位ビットを抽出", binaryData(new Uint8Array(await lsbImg.arrayBuffer()), lsbImg.type )],
    ]);
    setBusy(id, false);
    updateResult(id, data);
  })();

  return { initialBusy: true };
};

export const steganoAnalyzer: AnalyzerModule = {
  label: "画像ステガノグラフィ検査",
  detect,
  instantiate,
};
