const d=t=>{const e=new ArrayBuffer(t.byteLength);return new Uint8Array(e).set(new Uint8Array(t),0),e},a=async(t,e)=>{const n=d(t);return await new AudioContext().decodeAudioData(n)};export{a as d};
