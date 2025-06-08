// Single Page Application (SPA) redirect script for GitHub Pages
// This script helps handle routing for SPAs hosted on GitHub Pages

(function() {
  var redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect != location.href) {
    history.replaceState(null, null, redirect);
  }
})();

// Handle 404 redirects for GitHub Pages SPA routing
(function() {
  var l = window.location;
  if (l.search) {
    var query = {};
    l.search.slice(1).split('&').forEach(function(v) {
      var a = v.split('=');
      query[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
    });
    if (query.p !== undefined) {
      window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + (query.p || '') +
        (query.q ? ('?' + query.q) : '') +
        l.hash
      );
    }
  }
})();