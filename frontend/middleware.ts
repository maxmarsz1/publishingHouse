import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/auth/login', '/auth/register'];

interface MiddlewareRequest extends NextRequest {
  cookies: NextRequest['cookies'];
}

export function middleware(request: MiddlewareRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = pathname.startsWith('/myspace');
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute) {
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (accessToken || refreshToken) {
      const myspaceUrl = new URL('/myspace', request.url);
      return NextResponse.redirect(myspaceUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/myspace/:path*',
    '/auth/login',
    '/auth/register',
  ],
};