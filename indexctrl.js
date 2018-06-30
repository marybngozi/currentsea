import idb from 'idb';
function openDatabase() {
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('currencysea', 1, (upgradeDb) => {
    let store = upgradeDb.createObjectStore('currencyseas', {
      keyPath: 'id'
    });
  });
}
/* export default function IndexController(container) {
  this._container = container;
  this._lostConnectionToast = null;
  this._dbPromise = openDatabase();
  this._registerServiceWorker();

  var indexController = this;

  this._showCachedMessages().then( () => {
    indexController._openSocket();
  });

}
*/
IndexController.prototype._registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;

  var indexController = this;

  navigator.serviceWorker.register('/serviceWorker.js').then( (reg) => {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound',() => {
      indexController._trackInstalling(reg.installing);
    });
  });
/*
  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange',() => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

IndexController.prototype._showCachedMessages = () => {
  var indexController = this;

  return this._dbPromise.then( (db) => {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db) return;

    let index = db.transaction('currencyseas')
      .objectStore('currencyseas')/* .index('by-date') */;

    return index.getAll()/* .then( (messages) => {
      indexController._postsView.addPosts(messages.reverse());
    }); *//* 
  });
};

IndexController.prototype._trackInstalling = (worker) => {
  var indexController = this;
  worker.addEventListener('statechange', () => {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }
  });
};

// open a connection to the server for live updates
IndexController.prototype._openSocket = () => {
  var indexController = this;
  let latestPostDate = this._postsView.getLatestPostDate();

  // create a url pointing to /updates with the ws protocol
  var socketUrl = new URL('/updates', window.location);
  socketUrl.protocol = 'ws';

  if (latestPostDate) {
    socketUrl.search = 'since=' + latestPostDate.valueOf();
  }

  // this is a little hack for the settings page's tests,
  // it isn't needed for Wittr
  socketUrl.search += '&' + location.search.slice(1);

  var ws = new WebSocket(socketUrl.href);

  // add listeners
  ws.addEventListener('open', function () {
    if (indexController._lostConnectionToast) {
      indexController._lostConnectionToast.hide();
    }
  });

  ws.addEventListener('message', function (event) {
    requestAnimationFrame(function () {
      indexController._onSocketMessage(event.data);
    });
  });

  ws.addEventListener('close', function () {
    // tell the user
    if (!indexController._lostConnectionToast) {
      indexController._lostConnectionToast = indexController._toastsView.show("Unable to connect. Retrying…");
    }

    // try and reconnect in 5 seconds
    setTimeout(function () {
      indexController._openSocket();
    }, 5000);
  });
};

IndexController.prototype._cleanImageCache = function () {
  return this._dbPromise.then(function (db) {
    if (!db) return;

    var imagesNeeded = [];

    var tx = db.transaction('wittrs');
    return tx.objectStore('wittrs').getAll().then(function (messages) {
      messages.forEach(function (message) {
        if (message.photo) {
          imagesNeeded.push(message.photo);
        }
        imagesNeeded.push(message.avatar);
      });

      return caches.open('wittr-content-imgs');
    }).then(function (cache) {
      return cache.keys().then(function (requests) {
        requests.forEach(function (request) {
          var url = new URL(request.url);
          if (!imagesNeeded.includes(url.pathname)) cache.delete(request);
        });
      });
    });
  });
};

// called when the web socket sends message data
IndexController.prototype._onSocketMessage = function (data) {
  var messages = JSON.parse(data);

  this._dbPromise.then(function (db) {
    if (!db) return;

    var tx = db.transaction('wittrs', 'readwrite');
    var store = tx.objectStore('wittrs');
    messages.forEach(function (message) {
      store.put(message);
    });

    // limit store to 30 items
    store.index('by-date').openCursor(null, "prev").then(function (cursor) {
      return cursor.advance(30);
    }).then(function deleteRest(cursor) {
      if (!cursor) return;
      cursor.delete();
      return cursor.continue().then(deleteRest);
    });
  });

  this._postsView.addPosts(messages);
}; */