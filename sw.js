// initialises the cache key
const cacheName = 'currency-cache-v1'

// an array of files to be cached(the app shell)
const CachedFiles = [            
  'main.js',
  'https://github.com/marybngozi/currentsea/blob/master/favicon.png',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css?family=Galada',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
  'main.css'
]

// install event that installs all the files needed by the app shell
self.addEventListener('install', function (e) {
  console.log('[serviceWorker] install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[serviceWorker] caching app shell')
      return cache.addAll(CachedFiles)
    })
  )
})

// activate event that purges any outdated file making sure updated files are served
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function (cacheName) {
          return caches.delete(cacheName)
        })
      )
    })
  )
})

// fetch event handler that tries to get requested file from the cache first then the network if it doesn't find it in the cache
self.addEventListener('fetch', function (e) {
  console.log('[serviceWorker] fetch', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request)
    })
  )
})

// generic fallback
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function (response) {
      // Fall back to network
      return response || fetch(event.request)
    }).catch(function () {
      // If both fail, show a generic fallback:
      console.log('offline oo');
    })
  )
})
