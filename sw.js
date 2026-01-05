
const CACHE_NAME = 'samu-estudo-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './constants.ts',
  './types.ts',
  './manifest.json',
  'https://cdn.tailwindcss.com?plugins=forms,container-queries'
];

// Instalação: Cacheia os recursos básicos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Ignora chamadas de API do Google Search ou GenAI se existirem
  if (event.request.url.includes('google') || event.request.url.includes('genai')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cacheia a nova resposta para uso futuro (apenas se for GET bem sucedido)
        if (event.request.method === 'GET' && networkResponse.ok) {
           const responseToCache = networkResponse.clone();
           caches.open(CACHE_NAME).then((cache) => {
             cache.put(event.request, responseToCache);
           });
        }
        return networkResponse;
      }).catch(() => {
        // Se falhar e estiver offline, tenta retornar do cache
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
