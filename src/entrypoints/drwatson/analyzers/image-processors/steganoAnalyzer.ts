import { keyValueData, binaryData, textData, type Data } from "../../datatypes";
import { setBusy, updateResult, type AnalyzerModule } from "../../state";

const detect = (data: Data) => {
  if (data.type === "binary" && data.value.mime.startsWith("image")) {
    return "画像に見えない透かしデータが埋め込まれているかも？";
  }
  return null;
};

const instantiate = (src: Data, id: number) => {
  if (src.type !== "binary" || !src.value.mime.startsWith("image")) {
    return { initialResult: textData("UNEXPECTED: not an image.") };
  };

  (async () => {
    try {
      const { applyFilter } = await import("../../../../utils/image.ts");
      const blob = new Blob([src.value.array], { type: src.value.mime });
      const url = URL.createObjectURL(blob);
      const rImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 1] = arr[i + 0];
          arr[i + 2] = arr[i + 0];
          arr[i + 3] = 255;
        }
      });
      const gImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = arr[i + 1];
          arr[i + 2] = arr[i + 1];
          arr[i + 3] = 255;
        }
      });
      const bImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = arr[i + 2];
          arr[i + 1] = arr[i + 2];
          arr[i + 3] = 255;
        }
      });
      const aImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = arr[i + 3];
          arr[i + 1] = arr[i + 3];
          arr[i + 2] = arr[i + 3];
        }
      });
      const lsbImg = await applyFilter(url, (arr) => {
        for (let i = 0; i < arr.length; i += 1) {
          arr[i] = (arr[i] & 1) * 255;
        }
      });
      const data = keyValueData([[
        "R 成分のみ抽出",
         await binaryData(new Uint8Array(await rImg.arrayBuffer())),
      ], [
        "G 成分のみ抽出",
        await binaryData(new Uint8Array(await gImg.arrayBuffer())),
      ], [
        "B 成分のみ抽出",
        await binaryData(new Uint8Array(await bImg.arrayBuffer())),
      ], [
        "透明ピクセルを抽出",
        await binaryData(new Uint8Array(await aImg.arrayBuffer())),
      ], [
        "最下位ビットを抽出",
        await binaryData(new Uint8Array(await lsbImg.arrayBuffer())),
      ]]);
      setBusy(id, false);
      updateResult(id, data);
    } catch (e: any) {
      setBusy(id, false);
      updateResult(id, textData(`ERROR: ${"message" in e ? e.message : ""}`));
    }
  })();

  return { initialBusy: true };
};

export const steganoAnalyzer: AnalyzerModule = {
  label: "画像ステガノグラフィ検査",
  detect,
  instantiate,
};
