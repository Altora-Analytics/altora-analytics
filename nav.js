// Altora shared nav — single source of truth, injected on every page.
// Edit THIS file only; every page loads it next to the GoatCounter tag.
(function () {
  var SPORTS = [
    ["record-football.html",   "⚽", "Football",   "#3b82f6"],
    ["record-basketball.html", "🏀", "Basketball", "#f97316"],
    ["record-handball.html",   "🤾", "Handball",   "#14b8a6"],
    ["record-darts.html",      "🎯", "Darts",      "#ef4444"],
    ["record-snooker.html",    "🎱", "Snooker",    "#22c55e"],
    ["record-rugby.html",      "🏉", "Rugby",      "#facc15"],
    ["record-tennis.html",     "🎾", "Tennis",     "#ec4899"],
    ["record-esports.html",    "🎮", "Esports",    "#8b5cf6"],
    ["record-trading.html",    "📈", "Trading",    "#e8b84b"]
  ];
  var LINKS = [
    ["record.html", "Records"],
    ["research-log.html", "Research"],
    ["faq.html", "FAQ"],
    ["methodology.html", "Methodology"],
    ["about.html", "About"],
    ["corrections.html", "Corrections"],
    ["reviews.html", "Reviews"],
    ["https://whop.com/altora-analytics", "📘 Guides"]
  ];
  var here = (location.pathname.split("/").pop() || "index.html");

  var css = document.createElement("style");
  css.textContent =
    ".alt-nav{position:sticky;top:0;z-index:999;background:rgba(11,18,32,.92);backdrop-filter:blur(8px);" +
    "border-bottom:1px solid #22314a;font-family:'Segoe UI',system-ui,Arial,sans-serif}" +
    ".alt-nav .row1{display:flex;align-items:center;justify-content:space-between;max-width:1080px;" +
    "margin:0 auto;padding:9px 16px 7px}" +
    ".alt-nav .brand{color:#e8b84b;font-weight:800;letter-spacing:.18em;font-size:13px;text-decoration:none}" +
    ".alt-nav .links{display:flex;gap:14px;flex-wrap:wrap}" +
    ".alt-nav .links a{color:#8493a8;text-decoration:none;font-size:12.5px;font-weight:700}" +
    ".alt-nav .links a:hover,.alt-nav .links a.on{color:#f4f7fb}" +
    ".alt-nav .links a.guides{background:#e8b84b;color:#0b1220;padding:4px 12px;border-radius:999px}" +
    ".alt-nav .links a.guides:hover{color:#0b1220;filter:brightness(1.08)}" +
    ".alt-nav .chips{display:flex;gap:8px;overflow-x:auto;max-width:1080px;margin:0 auto;" +
    "padding:0 16px 9px;scrollbar-width:none}" +
    ".alt-nav .chips::-webkit-scrollbar{display:none}" +
    ".alt-nav .chips a{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;padding:4px 11px;" +
    "border:1px solid #22314a;border-radius:999px;background:#101d33;color:#c3cdd9;text-decoration:none;" +
    "font-size:12px;font-weight:700}" +
    ".alt-nav .chips a:hover{border-color:var(--c)}" +
    ".alt-nav .chips a.on{border-color:var(--c);color:var(--c)}";
  document.head.appendChild(css);

  var nav = document.createElement("nav");
  nav.className = "alt-nav";
  var links = LINKS.map(function (l) {
    var cls = [];
    if (here === l[0]) cls.push("on");
    if (l[1].indexOf("Guides") !== -1) cls.push("guides");
    var attr = cls.length ? " class='" + cls.join(" ") + "'" : "";
    return "<a href='" + l[0] + "'" + attr + ">" + l[1] + "</a>";
  }).join("");
  var chips = SPORTS.map(function (s) {
    var on = here === s[0] ? " class='on'" : "";
    return "<a href='" + s[0] + "' style='--c:" + s[3] + "'" + on + ">" +
           "<span>" + s[1] + "</span>" + s[2] + "</a>";
  }).join("");
  nav.innerHTML =
    "<div class='row1'><a class='brand' href='index.html'>ALTORA ANALYTICS</a>" +
    "<div class='links'>" + links + "</div></div>" +
    "<div class='chips'>" + chips + "</div>";
  document.body.insertBefore(nav, document.body.firstChild);

  // site-wide signature (skip pages whose own footer already carries it)
  if (document.body.innerText.indexOf("Nothing deleted") === -1) {
    var sig = document.createElement("p");
    sig.style.cssText = "text-align:center;color:#8493a8;font-size:12.5px;" +
      "margin:34px 16px 22px;font-family:'Segoe UI',system-ui,Arial,sans-serif";
    sig.textContent = "Every prediction tracked publicly. Nothing deleted.";
    document.body.appendChild(sig);
  }
})();

  // ---- PWA plumbing (2026-07-26): manifest + icons + service worker on every page ----
  (function () {
    if (!document.querySelector('link[rel="manifest"]')) {
      var m = document.createElement("link"); m.rel = "manifest"; m.href = "/manifest.webmanifest";
      document.head.appendChild(m);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      var t = document.createElement("meta"); t.name = "theme-color"; t.content = "#0b1220";
      document.head.appendChild(t);
    }
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      var a = document.createElement("link"); a.rel = "apple-touch-icon"; a.href = "/assets/apple-touch-icon.png";
      document.head.appendChild(a);
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").catch(function () {});
      });
    }
  })();
