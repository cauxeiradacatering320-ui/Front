import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('refresh_token')?.value || request.cookies.get('__session')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isAuthRoute && sessionToken) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const isHomeRoute = pathname.startsWith('/home');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!sessionToken && (isHomeRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/admin/:path*', '/login', '/register'],
};
