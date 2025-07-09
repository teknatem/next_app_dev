import { auth } from '@/shared/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Allow unauthenticated access to login page
  if (req.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
