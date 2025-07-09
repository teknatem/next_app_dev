
import { auth } from '@/shared/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Проверяем, включена ли аутентификация
const isAuthEnabled = process.env.AUTH_ENABLED !== 'false';

// Middleware function
export function middleware(req: NextRequest) {
  // Если аутентификация отключена, пропускаем все запросы
  if (!isAuthEnabled) {
    return NextResponse.next();
  }

  // Используем NextAuth middleware только если аутентификация включена
  return auth((authReq) => {
    const isLoggedIn = !!authReq.auth;

    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', authReq.nextUrl));
    }

    return NextResponse.next();
  })(req);
}

export const config = {
  // Защищаем все маршруты, кроме служебных и страницы входа
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
};
