(function () {
  var script = document.currentScript;
  var id = script && script.getAttribute('data-ga-id');
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
})();
