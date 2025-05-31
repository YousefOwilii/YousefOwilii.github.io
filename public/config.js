/**
 * Configuration for the website
 * This helps with path resolution on GitHub Pages
 */

(function() {
  // Determine if we're on GitHub Pages by checking the hostname
  const isGitHubPages = 
    window.location.hostname.indexOf('github.io') !== -1 || 
    window.location.hostname.indexOf('yousefowilii.github.io') !== -1;
  
  // Set the base path for assets
  let basePath = '/';
  
  // For GitHub Pages, we may need to adjust paths
  if (isGitHubPages) {
    // If this is a project page (username.github.io/repo-name)
    // Extract the repository name from the pathname
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1] !== '') {
      basePath = '/' + pathParts[1] + '/';
    }
  }
  
  // Set configuration in the window object
  window.siteConfig = {
    basePath,
    isGitHubPages,
    apiProxies: [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/',
      'https://proxy.cors.sh/'
    ]
  };
})(); 