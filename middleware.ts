import NextAuth from 'next-auth';
import { authConfig } from '@/shared/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_ENABLED = process.env.AUTH_ENABLED !== 'false';
const { auth } = NextAuth(authConfig);

const explicitAuthMiddleware = auth((req) => {
  const isLoggedIn = !!req.auth;

  // Если пользователь не авторизован, принудительно перенаправляем на страницу входа.
  if (!isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // Если авторизован, позволяем запросу пройти дальше.
  return NextResponse.next();
});

// Пустышка для случая, когда аутентификация отключена
function dummyMiddleware(_req: NextRequest) {
  return NextResponse.next();
}

// В зависимости от флага, экспортируем либо настоящую middleware, либо пустышку.
// Больше никаких оберток с логированием.
export const middleware = AUTH_ENABLED
  ? (explicitAuthMiddleware as any)
  : dummyMiddleware;

export const config = {
  // Защищаем все маршруты, кроме служебных и страницы входа
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
};
