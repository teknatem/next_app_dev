import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Проверяем переменную окружения
const isAuthEnabled = () => process.env.AUTH_ENABLED !== 'false';

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  trustHost: true,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[Authorize Callback] Received credentials:', credentials);
        if (credentials?.email && credentials?.password) {
          const user = { id: '1', name: 'Dev User', email: 'dev@local' };
          console.log('[Authorize Callback] Login SUCCESS. Returning user:', user);
          return user;
        }
        console.log('[Authorize Callback] Login FAILED. Returning null.');
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  events: {
    async signOut(message) {
      console.log('[SignOut Event]', message);
    }
  },
  pages: {
    signIn: '/login'
  }
};

// Мок-функции для отключенной аутентификации
const mockAuth = async () => ({
  user: {
    name: 'Test User',
    email: 'test@example.com',
    image: '/placeholder-user.jpg'
  }
});

const mockHandlers = {
  GET: async () => new Response('Auth disabled', { status: 200 }),
  POST: async () => new Response('Auth disabled', { status: 200 })
};

// Инициализируем NextAuth только если аутентификация включена
const nextAuthInstance = isAuthEnabled() ? NextAuth(authConfig) : null;

// Экспортируем обработчики
export const handlers = nextAuthInstance 
  ? nextAuthInstance.handlers 
  : mockHandlers;

// Экспортируем функцию auth
export const auth = nextAuthInstance 
  ? nextAuthInstance.auth 
  : mockAuth;

// Экспортируем функции signIn и signOut
export const signIn = nextAuthInstance 
  ? nextAuthInstance.signIn 
  : async () => { throw new Error('Auth is disabled'); };

export const signOut = nextAuthInstance 
  ? nextAuthInstance.signOut 
  : async () => { throw new Error('Auth is disabled'); };