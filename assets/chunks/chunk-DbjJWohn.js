import{e as c}from"./chunk-BBGo2Y6T.js";import"./chunk-16BH05ft.js";const l=/(\r\n?|\n)/,m=async(r,o,n)=>{if(r.type!=="text")throw new Error("テキストデータではありません");await o({status:"並べ替えています"});const t=r.value.match(l);if(!t)return r;const a=r.value.replace(t[0],`
`).split(`
`).sort((e,s)=>e===s?0:e<s?n==="asc"?-1:1:n==="asc"?1:-1).join(t[0]);return c(a,r.label,"並べ替えたテキスト")};export{m as processor};
