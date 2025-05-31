/**
 * CORS Proxy Helper for GitHub Pages
 * This script provides helper functions for proxying API requests to avoid CORS issues.
 */

// List of available CORS proxies to try - use config if available
const availableProxies = 
  (typeof window !== 'undefined' && window.siteConfig && window.siteConfig.apiProxies) 
    ? window.siteConfig.apiProxies 
    : [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/',
        'https://proxy.cors.sh/'
      ];

/**
 * Try a fetch request with multiple proxies until one succeeds
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
async function proxyFetch(url, options = {}) {
  // First try direct fetch
  try {
    const response = await fetch(url, { ...options, mode: 'cors' });
    if (response.ok) return response;
  } catch (error) {
    console.log('Direct fetch failed:', error);
  }

  // Try each proxy in sequence
  for (const proxy of availableProxies) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      console.log(`Trying proxy: ${proxyUrl}`);
      
      const response = await fetch(proxyUrl, options);
      if (response.ok) {
        console.log(`Proxy ${proxy} succeeded`);
        return response;
      }
    } catch (error) {
      console.log(`Proxy ${proxy} failed:`, error);
    }
  }

  // If all proxies fail, throw error
  throw new Error('All proxies failed');
}

// Export the helper for use in other scripts
window.proxyHelper = {
  proxyFetch,
  availableProxies
}; 