const s=async a=>new Promise(r=>{const e=new FileReader;e.addEventListener("load",()=>r(e.result)),e.readAsDataURL(a)});export{s as r};
