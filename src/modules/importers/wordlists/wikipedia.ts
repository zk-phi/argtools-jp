import titles from "../../../../resources/jawiki-all-titles-formatted?raw";

export const data = titles.split("\n").map((row, ix) => ({
  id: ix,
  key: row,
  value: ""
}));
