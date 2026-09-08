/**
 * Hub language: localStorage preference > browser detect > English fallback.
 * Manual lang-bar clicks save preference and override auto-detection next visit.
 */
(function () {
  var KEY = "hubLang";
  var PATHS = {
    ko: "/",
    en: "/en/",
    ja: "/jp/",
    es: "/es/",
    hi: "/hi/"
  };

  function detectLang() {
    var raw = String(navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (raw.indexOf("ko") === 0) return "ko";
    if (raw.indexOf("ja") === 0) return "ja";
    if (raw.indexOf("es") === 0) return "es";
    if (raw.indexOf("hi") === 0) return "hi";
    if (raw.indexOf("en") === 0) return "en";
    return "en";
  }

  function readSaved() {
    try {
      var s = localStorage.getItem(KEY);
      if (s && PATHS[s]) return s;
    } catch (e) {}
    return null;
  }

  function preferredLang() {
    return readSaved() || detectLang();
  }

  function pageLang() {
    var p = (location.pathname || "/").replace(/\/+$/, "") || "/";
    if (p === "/" || p === "/kr" || p === "/ko") return "ko";
    if (p.indexOf("/en") === 0) return "en";
    if (p.indexOf("/jp") === 0 || p.indexOf("/ja") === 0) return "ja";
    if (p.indexOf("/es") === 0) return "es";
    if (p.indexOf("/hi") === 0) return "hi";
    return "ko";
  }

  function saveLang(lang) {
    if (!PATHS[lang]) return;
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {}
  }

  // Optional escape: ?noredirect=1
  var q = location.search || "";
  if (q.indexOf("noredirect=1") === -1) {
    var want = preferredLang();
    var have = pageLang();
    if (want !== have) {
      location.replace(PATHS[want] || "/en/");
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector(".lang-bar");
    if (!bar) return;
    bar.querySelectorAll("a[data-lang]").forEach(function (a) {
      a.addEventListener("click", function () {
        saveLang(a.getAttribute("data-lang"));
      });
    });
  });
})();
