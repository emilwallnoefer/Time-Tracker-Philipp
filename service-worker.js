const CACHE='hour-logger-76';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))) });
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message',e=>{
  if(e.data && e.data.type==='SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch',e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });

self.addEventListener('message',e=>{
  if(e && e.data && (e.data==='clearCaches' || e.data.type==='clearCaches')){
    e.waitUntil((async()=>{
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
      const clients=await self.clients.matchAll();
      clients.forEach(c=>c.postMessage({type:'cachesCleared'}));
    })());
  }
  if(e && e.data && (e.data==='SKIP_WAITING' || (e.data.type && e.data.type==='SKIP_WAITING'))){
    self.skipWaiting();
  }
});
