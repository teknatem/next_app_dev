
import { authMiddleware } from '@/shared/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Проверяем, включена ли аутентификация
const isAuthEnabled = process.env.AUTH_ENABLED !== 'false';

// Middleware function
export async function middleware(req: NextRequest) {
  // Если аутентификация отключена, пропускаем все запросы
  if (!isAuthEnabled) {
    return NextResponse.next();
  }

  // Используем NextAuth middleware только если аутентификация включена
  const authHandler = authMiddleware((authReq: any) => {
    const isLoggedIn = !!authReq.auth;

    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', authReq.nextUrl));
    }

    return NextResponse.next();
  });
  
  // Handle both function and Promise return types
  if (typeof authHandler === 'function') {
    return authHandler(req);
  }
  
  // If authHandler is a Promise, await it
  if (authHandler && typeof authHandler.then === 'function') {
    return await authHandler;
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
