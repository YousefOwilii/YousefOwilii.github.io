import { NextResponse } from 'next/server';

// This middleware handles CORS for all routes
export function middleware(request) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '*';
  
  // Create a new response
  const response = NextResponse.next();
  
  // Add the CORS headers to the response
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin');
  
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: '/api/:path*',
}; 