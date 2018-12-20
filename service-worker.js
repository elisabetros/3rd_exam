var CACHE_VERSION = "v3";
var urlsToCache = [
  "/",
  "/js/login.js",
  "/js/script.js",
  "/style/style.css",
  "/index.html",
  "/img/beach.jpg",
  "/img/bee.svg",
  "/img/bird.svg",
  "/img/boling.jpg",
  "/img/cleaning.jpg",
  "/img/couple.jpg",
  "/img/diskette.svg",
  "/img/email.svg",
  "/img/faceicon.png",
  "/img/fallen-tree.jpg",
  "/img/forest-ground.jpg",
  "/img/geolocation.svg",
  "/img/grass.svg",
  "/img/gribskov.png",
  "/img/hands-box.jpg",
  "/img/hiking.jpg",
  "/img/kikkert.jpg",
  "/img/leaf.svg",
  "/img/office.svg",
  "/img/pine.svg",
  "/img/planting.jpg",
  "/img/plantning.jpg",
  "/img/reed.svg",
  "/img/remove.svg",
  "/img/sun.svg",
  "/img/telephone.svg",
  "/img/tree.svg",
  "/img/twitticon.png",
  "/img/volunteer.jpg",
  "/img/waves.svg",
  "/img/whale.svg",
  "/img/woman.jpg",
  "/img/world.svg",
  "/img/write.svg",
  "/fonts/futura/futura_bold_font.ttf",
  "/fonts/opensans/OpenSans-Regular.ttf"
];

self.addEventListener("install", function(event) {
  console.log("install");
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      console.log("Opened cache");
      return cache
        .addAll(urlsToCache)
        .then(() => console.log("Assets added to cache"))
        .catch(err => console.log("Error while fetching assets", err));
    })
  );
});

self.addEventListener("fetch", function(event) {
  console.log("Fetch event: ", event);
  console.log("Fetch event for ", event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        if (response) {
          console.log("Found ", event.request.url, " in cache");
          return response;
        }
        console.log("Network request for ", event.request.url);
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match("fourohfour.html");
          }
          return caches.open(urlsToCache).then(function(cache) {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch(function(error) {
        console.log("Error, ", error);
        return caches.match("offline.html");
      })
  );
});

self.addEventListener("activate", function(event) {
  console.log("activate!");
  var expectedCacheNames = Object.keys(CACHE_VERSION).map(function(key) {
    return CACHE_VERSION[key];
  });
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key, i) {
          if (expectedCacheNames.indexOf(key) === -1) {
            return caches.delete(keys[i]);
          }
        })
      );
    })
  );
});
