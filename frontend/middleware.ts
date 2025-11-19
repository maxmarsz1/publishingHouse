import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = pathname.startsWith('/myspace');
  const isAuthRoute = authRoutes.includes(pathname);

  // ---------------------------
  // 1. Protect /myspace/*
  // ---------------------------
  if (isProtectedRoute) {
    // If no access token AND no refresh token → fully logged out
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If accessToken missing but refreshToken exists → allow
    // Axios on the server will refresh the token automatically.
    return NextResponse.next();
  }

  // ---------------------------
  // 2. Block access to login/register if logged in
  // ---------------------------
  if (isAuthRoute) {
    if (accessToken || refreshToken) {
      const myspaceUrl = new URL('/myspace', request.url);
      return NextResponse.redirect(myspaceUrl);
    }
  }

  // Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/myspace/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
