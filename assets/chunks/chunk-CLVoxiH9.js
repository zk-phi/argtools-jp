import{e as a}from"./chunk-CodfL6ju.js";import"./chunk-16BH05ft.js";const n=(e,t)=>{var o;return((o=e.replace(/[\r\n]+/g,"").match(new RegExp(`.{1,${t}}`,"g")))==null?void 0:o.join(`
`))??""},m=async(e,t,r)=>{if(e.type!=="text")throw new Error("テキストデータではありません");return await t({status:"改行しています"}),a(n(e.value,r),e.label,"")};export{m as processor};
