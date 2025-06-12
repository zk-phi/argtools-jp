import ExifReader from "exifreader";
import type { StateReporter } from "../../..";
import { objectData, multipleData, type Data } from "../../../../datatypes";

const _flattenTags = (tags: any): any => (
  Object.fromEntries(
    Object.keys(tags).map(key => (
      tags[key]?.description ? (
        [key, tags[key]?.description]
      ) : typeof tags[key] === "object" ? (
        [key, _flattenTags(tags[key])]
      ) : (
        [key, tags[key]]
      )
    ))
  )
);

export const getAllTags = (buffer: ArrayBufferLike): any => {
  const raw = ExifReader.load(buffer, { expanded: false });
  const tags = _flattenTags(raw);
  return {
    "基本情報": {
      "形式": tags.FileType ?? "-",
      "幅": tags["Image Width"] ?? "-",
      "高さ": tags["Image Height"] ?? "-",
      "ビット深度": (
        tags["Bits Per Sample"] ?? tags["Bit Depth"] ?? tags["Bits Per Pixel"] ?? "-"
      ),
      "色空間": tags.ColorSpace ?? "-",
    },
    "日時": {
      "更新日時": tags.DateTime ?? "-",
      "作成日時": tags.DateTimeOriginal ?? tags.DateCreated ?? "-",
    },
    "撮影地": {
      "緯度": tags.GPSLatitude ?? "-",
      "経度": tags.GPSLongitude ?? "-",
      "高度": tags.GPSAltitude ?? "-",
    },
    "機材など": {
      "メーカー": tags.Make ?? "-",
      "機種": tags.Model ?? "-",
      "センサー方式": tags.SensingMethod ?? "-",
    },
    "レンズ": {
      "メーカー": tags.LensMake ?? "-",
      "モデル": tags.LensModel ?? "-",
      "最大絞り": tags.MaxApertureValue ?? "-",
      "焦点距離": tags.FocalLength ?? "-",
      "焦点距離（35mm 換算）": tags.FocalLengthIn35mmFilm ?? "-",
    },
    "撮影状況": {
      "露出": tags.ExposureTime ?? "-",
      "露出モード": tags.ExposureMode ?? "-",
      "F値": tags.FNumber ?? "-",
      "撮影モード": tags.ExposureProgram ?? "-",
      "ISO感度": tags.ISOSpeedRatings ?? "-",
      "シャッタースピード": tags.ShutterSpeedValue ?? "-",
      "絞り": tags.ApertureValue ?? "-",
      "輝度": tags.BrightnessValue ?? "-",
      "コントラスト": tags.Contrast ?? "-",
      "彩度": tags.Saturation ?? "-",
      "シャープネス": tags.Sharpness ?? "-",
      "ホワイトバランス": tags.WhiteBalance ?? "-",
      "露出補正": tags.ExposureBiasValue ?? "-",
      "フラッシュ": tags.Flash ?? "-",
      "デジタルズーム倍率": tags.DigitalZoomRatio ?? "-",
      "視野角": tags.FieldOfView ?? "-",
    },
    "他": {
      "編集ソフト": tags.Software ?? "-",
      "アーティスト": tags.Artist ?? tags.Creator ?? "-",
      "コメント": tags.UserComment ?? "-",
      "クレジット": tags.Credit ?? "-",
      "著作権": tags.Copyright ?? tags["Copyright Notice"] ?? "-",
      "キャプション": tags["Caption/Abstract"] ?? "-",
      "キーワード": tags.Keyword ?? "-",
      "タイトル": tags.Headline ?? "-",
    },
    "生データ": tags,
  };
};

export const processor = async (input: Data, reporter: StateReporter) => {
  if (input.type !== "binary" || !input.mime.startsWith("image")) {
    throw new Error("画像データでないか、非対応の形式です");
  }
  await reporter({ status: "抽出しています" });
  const tags = getAllTags(input.value.buffer);
  const str = JSON.stringify(tags);
  return objectData(str, JSON.parse(str), "抽出できた情報", "text/json", ".json");
};
