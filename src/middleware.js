import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Initialize response
  const res = NextResponse.next();
  
  // Create supabase middleware client
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if it exists
  const { data: { session } } = await supabase.auth.getSession();

  const protectedPaths = ['/feed', '/register', '/profile', '/edit-profile'];
  const isProtectedPath = protectedPaths.some((path) => 
    req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
  );

  // Force redirect if accessing protected route without session
  if (isProtectedPath && !session?.user) {
    const redirectUrl = new URL('/signin', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged in users away from auth pages
  if (session?.user && ['/signin', '/signup'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/feed', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/feed',
    '/register',
    '/profile',
    '/edit-profile',
    '/feed/:path*',
    '/register/:path*',
    '/profile/:path*',
    '/edit-profile/:path*',
    '/signin',
    '/signup'
  ]
};