import { simpleAnalyzerFactory } from "../../../analyzerFactories";
import type { StateReporter } from "../../..";
import type { Data } from "../../../../datatypes";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.startsWith("image")) {
    return "もし、バーコードらしきものが写っているなら";
  }
  return null;
};

const analyze = async (input: Data, reporter: StateReporter) => {
  await reporter({ status: "ツールを読み込んでいます" });
  const { processor } = await import("./processor");
  return await processor(input, reporter);
};

export const barcodeScanner = simpleAnalyzerFactory({
  label: "バーコードを読み取り",
  app: "/argtools-jp/apps/barcode-scanner",
  description: (
    <>
      <p>
        読み取りに失敗する場合は、
        <a href="/argtools-jp/apps/image-investigator" target="_blank" rel="noreferrer">
          補正ツール
        </a>
        などで調整してみてください。
      </p>
      <p>
        QR コードは
        <a href="/argtools-jp/apps/qr-scanner" target="_blank" rel="noreferrer">
          QR コードリーダー
        </a>
        をお試しください。
      </p>
    </>
  ),
  detect,
  analyze,
});
