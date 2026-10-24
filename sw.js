const C='model-gorunturleyici-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const store=(r,res)=>{ if(res&&(res.ok||res.type==='opaque')){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; };
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith('http'))return;
  const same=new URL(r.url).origin===location.origin;
  if(same){ // kendi dosyaları: önce ağ, çevrimdışıysa önbellek
    e.respondWith(fetch(r).then(res=>store(r,res)).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
  }else{    // CDN (Three.js): önce önbellek
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>store(r,res))));
  }
});
