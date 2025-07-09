
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Проверяем переменную окружения безопасно
function isAuthEnabled(): boolean {
  return process.env.AUTH_ENABLED !== 'false';
}

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV !== 'production',
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[Authorize Callback] Received credentials:', credentials);
        // Для разработки мы просто возвращаем мокового пользователя, если что-то введено.
        // В реальном приложении здесь была бы проверка в базе данных.
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

// Мок функции для случая отключенной аутентификации
const mockAuth = async (req?: any) => {
  if (req) {
    return null;
  }
  return {
    user: {
      name: 'Test User',
      email: 'test@example.com',
      image: '/placeholder-user.jpg'
    }
  };
};

// Ленивая инициализация NextAuth
let authInstance: any = null;

function getAuthInstance() {
  if (!authInstance && isAuthEnabled()) {
    authInstance = NextAuth(authConfig);
  }
  return authInstance;
}

// Экспортируем обернутые функции
export const handlers = isAuthEnabled() 
  ? (() => {
      const instance = getAuthInstance();
      return instance ? instance.handlers : { GET: mockAuth, POST: mockAuth };
    })()
  : { GET: mockAuth, POST: mockAuth };

export const auth = isAuthEnabled() 
  ? (() => {
      const instance = getAuthInstance();
      return instance ? instance.auth : mockAuth;
    })()
  : mockAuth;

export const signIn = isAuthEnabled() 
  ? (() => {
      const instance = getAuthInstance();
      return instance ? instance.signIn : async () => {};
    })()
  : async () => {};

export const signOut = isAuthEnabled() 
  ? (() => {
      const instance = getAuthInstance();
      return instance ? instance.signOut : async () => {};
    })()
  : async () => {};
