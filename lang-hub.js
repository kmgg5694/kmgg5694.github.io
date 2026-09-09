/**
 * Language bar: remember manual choice so root auto-redirect stops.
 * Auto-detect redirect lives only in root index.html (langChoice gate).
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector(".lang-bar");
    if (!bar) return;
    bar.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        try {
          localStorage.setItem("langChoice", "1");
        } catch (e) {}
      });
    });
  });
})();
