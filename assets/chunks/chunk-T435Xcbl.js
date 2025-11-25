import{t as a}from"./chunk-SRRSywQZ.js";import"./chunk-D8MOA9rb.js";const n=(e,t)=>{var o;return((o=e.replace(/[\r\n]+/g,"").match(new RegExp(`.{1,${t}}`,"g")))==null?void 0:o.join(`
`))??""},m=async(e,t,r)=>{if(e.type!=="text")throw new Error("テキストデータではありません");return await t({status:"改行しています"}),a(n(e.value,r),e.label,"")};export{m as processor};
