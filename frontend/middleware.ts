import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/myspace', '/myspace/publishers', '/myspace/settings'];

const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const url = request.nextUrl.pathname;

  if (url.startsWith('/myspace')) {
    if (!accessToken) {
      const absoluteUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(absoluteUrl);
    }
  }
  
  if (authRoutes.includes(url)) {
    if (accessToken) {
      const absoluteUrl = new URL('/myspace', request.url);
      return NextResponse.redirect(absoluteUrl);
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