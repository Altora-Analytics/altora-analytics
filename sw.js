/* Altora Analytics service worker (PWA, 2026-07-26).
 *
 * Strategy is deliberately conservative for a site whose product is a LIVE record:
 *   - HTML, CSV and JSON: NETWORK-FIRST. A stale record page is worse than a slow one —
 *     people screenshot these pages as receipts, and we will not litigate our own cache.
 *     Cache is the offline fallback only.
 *   - Images and static assets: cache-first (immutable in practice; card PNGs are dated).
 * Bump VERSION to invalidate everything after a structural site change.
 */
const VERSION = "altora-v1";
const RUNTIME = VERSION + "-runtime";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(RUNTIME).then((c) => c.addAll(["/", "/index.html"])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isFreshness(req, url) {
  if (req.mode === "navigate") return true;
  return /\.(html|csv|json|webmanifest)$/.test(url.pathname) || url.pathname === "/";
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // never touch third-party requests

  if (isFreshness(req, url)) {
    // network-first: fresh when online, last-known copy when not
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match("/index.html"))
        )
    );
  } else {
    // assets: cache-first with background fill
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
  }
});
