import{t as a}from"./chunk-D0I35cuJ.js";import"./chunk-16BH05ft.js";const c=/(\r\n?|\n)/,i=/(\r\n?|\n)/g,g=async(n,o,t)=>{if(n.type!=="text")throw new Error("テキストデータではありません");await o({status:"並べ替えています"});const r=n.value.match(c);if(!r)return n;const l=n.value.replaceAll(i,`
`).split(`
`).sort((e,s)=>e===s?0:e<s?t==="asc"?-1:1:t==="asc"?1:-1).join(r[0]);return a(l,"並べ替えたテキスト")};export{g as processor};
