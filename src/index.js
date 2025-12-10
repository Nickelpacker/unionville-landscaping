// Cloudflare Worker to serve static HTML website
// This worker serves static files using the ASSETS binding

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Serve index.html for root path
    if (path === '/' || path === '') {
      path = '/src/index.html';
    }
    // Handle CSS file - HTML references style.css, which is in src/
    else if (path === '/style.css') {
      path = '/src/style.css';
    }
    // Handle JS files - they're in the root js/ directory
    // Paths like /js/recaptcha.js should work as-is

    // Try to fetch the asset
    try {
      const assetRequest = new Request(new URL(path, request.url));
      const response = await env.ASSETS.fetch(assetRequest);
      
      if (response.status !== 404) {
        // Set correct content types
        const headers = new Headers(response.headers);
        
        if (path.endsWith('.html')) {
          headers.set('Content-Type', 'text/html; charset=utf-8');
        } else if (path.endsWith('.css')) {
          headers.set('Content-Type', 'text/css; charset=utf-8');
        } else if (path.endsWith('.js')) {
          headers.set('Content-Type', 'application/javascript; charset=utf-8');
        }
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }
    } catch (e) {
      // Fall through to 404
    }

    return new Response('Not Found', { status: 404 });
  }
};

