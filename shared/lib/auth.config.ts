import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Если пользователь на странице входа, ничего не делаем.
      if (nextUrl.pathname === '/login') {
        return true;
      }

      // Если пользователь не авторизован, перенаправляем на страницу входа.
      if (!isLoggedIn) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    }
  },
  providers: [] // Провайдеры будут добавлены в основном файле auth.ts
} satisfies NextAuthConfig;
