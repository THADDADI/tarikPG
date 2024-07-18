/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-a9fe0588'], (function (workbox) { 'use strict';

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "128.png",
    "revision": "ac3c0f4b8a5e71bcfcd7d8d6c3b57f50"
  }, {
    "url": "256.png",
    "revision": "12f19b60f436434e56b97c40fc6c3582"
  }, {
    "url": "384.png",
    "revision": "24fd7519fa80a2b89ff49c3d84c36e0c"
  }, {
    "url": "512.png",
    "revision": "f286c1dec1df9ed9b9018d2b37a74783"
  }, {
    "url": "assets/index-4eUVEHjm.css",
    "revision": null
  }, {
    "url": "assets/index-MLGc24QL.js",
    "revision": null
  }, {
    "url": "assets/no-internet-DXJsBtTE.jpg",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-D5gOYdM7.js",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "d7d3e200049c2cb30bf12116277bc4eb"
  }, {
    "url": "manifest.webmanifest",
    "revision": "ade0867938ab47d6978492e0d4886fab"
  }, {
    "url": "maskable_icon.png",
    "revision": "856c235319c0ffe2a7fd4c2627ac7978"
  }, {
    "url": "vite.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "maskable_icon.png",
    "revision": "856c235319c0ffe2a7fd4c2627ac7978"
  }, {
    "url": "128.png",
    "revision": "ac3c0f4b8a5e71bcfcd7d8d6c3b57f50"
  }, {
    "url": "256.png",
    "revision": "12f19b60f436434e56b97c40fc6c3582"
  }, {
    "url": "384.png",
    "revision": "24fd7519fa80a2b89ff49c3d84c36e0c"
  }, {
    "url": "512.png",
    "revision": "f286c1dec1df9ed9b9018d2b37a74783"
  }, {
    "url": "vite.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "manifest.webmanifest",
    "revision": "ade0867938ab47d6978492e0d4886fab"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(({
    url
  }) => {
    return url.href.includes("/api/Items");
  }, new workbox.CacheFirst({
    "cacheName": "api-cache",
    plugins: [new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
