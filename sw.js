var cacheName = 'Tetris-v1.0';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/options.js',
  '/scenes/preload.js',
  '/scenes/pause.js',
  '/scenes/title.js',

  '/classes/settings.js',

  '/assets/sprites/background.png',
  '/assets/sprites/particle.png',
  '/assets/block_samples.png',
  '/assets/block0.png',
  '/assets/block1.png',
  '/assets/block2.png',
  '/assets/block3.png',
  '/assets/block4.png',
  '/assets/block5.png',
  '/assets/block6.png',
  '/assets/block7.png',
  '/assets/field.png',
  '/assets/game_icons.png',
  '/assets/hero.png',
  '/assets/logo.png',
  '/assets/platform.png',
  '/assets/shapeicons.png',
  '/assets/toggles.png',





  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',

  '/assets/audio/clear.wav',
  '/assets/audio/gameover.mp3',
  '/assets/audio/levelup.mp3',
  '/assets/audio/move.mp3',
  '/assets/audio/pause.mp3',
  '/assets/audio/pause.mp3',
  '/assets/audio/rot.mp3',
  '/assets/audio/set.mp3',
  '/assets/audio/tetris.mp3',
  '/assets/audio/theme1.mp3',
  '/assets/audio/theme2.mp3',
  '/assets/audio/theme3.wav',
  '/assets/audio/theme4.mp3',





  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});