/* Livello dati: wrapper minimale su IndexedDB.
   Store: exercises (esercizi utente), sessions (sedute salvate),
   settings (coppie chiave/valore, es. configurazione fasi).
   Espone window.RUGBY.DB con metodi che restituiscono Promise. */
window.RUGBY = window.RUGBY || {};

RUGBY.DB = (function () {
  var DB_NAME = 'rugbytrain';
  var DB_VERSION = 1;
  var _db = null;

  function open() {
    return new Promise(function (resolve, reject) {
      if (_db) return resolve(_db);
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('exercises')) {
          db.createObjectStore('exercises', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      req.onsuccess = function () { _db = req.result; resolve(_db); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function reqP(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function withStore(store, mode) {
    return open().then(function (db) {
      return db.transaction(store, mode).objectStore(store);
    });
  }

  return {
    getAll: function (store) {
      return withStore(store, 'readonly').then(function (s) { return reqP(s.getAll()); });
    },
    get: function (store, id) {
      return withStore(store, 'readonly').then(function (s) { return reqP(s.get(id)); });
    },
    put: function (store, value) {
      return withStore(store, 'readwrite').then(function (s) {
        return reqP(s.put(value)).then(function () { return value; });
      });
    },
    delete: function (store, id) {
      return withStore(store, 'readwrite').then(function (s) { return reqP(s.delete(id)); });
    },
    clear: function (store) {
      return withStore(store, 'readwrite').then(function (s) { return reqP(s.clear()); });
    },
    // settings: comodi helper chiave/valore
    getSetting: function (key) {
      return this.get('settings', key).then(function (row) { return row ? row.value : undefined; });
    },
    setSetting: function (key, value) {
      return this.put('settings', { key: key, value: value });
    }
  };
})();
