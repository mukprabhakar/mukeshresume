// Service Worker for caching and offline support
const CACHE_NAME = 'mukesh-portfolio-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/robots.txt',
  '/sitemap.xml',
  '/404.html'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse
      }

      // Fetch from network and cache the response
      return fetch(event.request).then((networkResponse) => {
        // Don't cache error responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse
        }

        // Clone the response (streams can only be consumed once)
        const responseToCache = networkResponse.clone()

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache API requests or external resources
          if (!event.request.url.includes('api') && !event.request.url.includes('cloudinary')) {
            cache.put(event.request, responseToCache)
          }
        })

        return networkResponse
      }).catch(() => {
        // Fallback for offline navigation
        if (event.request.destination === 'document') {
          return caches.match('/index.html')
        }
        
        // Fallback for images
        if (event.request.destination === 'image') {
          return caches.match('/favicon.png')
        }
      })
    })
  )
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
