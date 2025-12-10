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

    // Try to fetch the asset
    try {
      const assetRequest = new Request(new URL(path, request.url));
      const response = await env.ASSETS.fetch(assetRequest);
      
      if (response.status !== 404) {
        return response;
      }
    } catch (e) {
      // Fall through to 404
    }

    return new Response('Not Found', { status: 404 });
  }
};

