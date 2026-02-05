
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url);
  const termId = searchParams.get('term');

  // Only handle the root path with a 'term' parameter
  // and exclude static assets/API routes
  if (
    (pathname === '/' || pathname === '/index.html') && 
    termId && 
    !pathname.includes('.') && 
    !pathname.startsWith('/api/')
  ) {
    // Rewrite to our share API which will inject the meta tags
    const url = request.nextUrl.clone();
    url.pathname = '/api/share';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
