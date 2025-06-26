import type { Data } from "../../../datatypes";
import type { AnalyzerModule } from "../../";

const detect = (data: Data) => {
  if (data.type === "binary" && data.mime.endsWith("/pdf")) {
    return "もし、 PDF に黒塗りの部分などがあるなら";
  }
  return null;
};

const component = () => (
  <>
    <p>黒塗りされた PDF などは、編集ツールで復元できるかもしれません</p>
    <ul>
      <li>
        <a href="https://ja.libreoffice.org" target="_blank" rel="noreferrer">
          LibreOffice
        </a> (無料)
      </li>
      <li>
        <a href="https://www.office.com" target="_blank" rel="noreferrer">
          Microsoft Office
        </a>
      </li>
      <li>
        <a href="https://www.adobe.com/jp/acrobat.html" target="_blank" rel="noreferrer">
          Adobe Acrobat
        </a>
      </li>
      <li>
        など
      </li>
    </ul>
  </>
);

export const pdfSuggestor: AnalyzerModule = {
  label: "💡 PDF を編集",
  detect,
  component,
};
