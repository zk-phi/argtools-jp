const i=e=>e.split(`
`).filter(t=>t.length>0).map((t,r)=>{const[n,o,a,s]=t.split(","),c=a!=="*"?`${o}（${a}）`:o!=="*"?`${n}（${o}）`:`${n}`;return{id:r,key:s,value:c}});export{i as f};
