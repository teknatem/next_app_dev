import { auth } from '@/shared/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Проверяем, включена ли аутентификация
const isAuthEnabled = process.env.AUTH_ENABLED !== 'false';

// Если аутентификация отключена, пропускаем все запросы
if (!isAuthEnabled) {
  export function middleware(_req: NextRequest) {
    return NextResponse.next();
  }
} else {
  // Используем NextAuth middleware
  export const middleware = auth((req) => {
    const isLoggedIn = !!req.auth;

    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
  });
}

export const config = {
  // Защищаем все маршруты, кроме служебных и страницы входа
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
};
