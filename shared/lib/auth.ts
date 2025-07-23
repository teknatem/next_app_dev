import bcrypt from 'bcryptjs';
import { eq, count } from 'drizzle-orm';
import NextAuth, {
  type DefaultSession,
  type User,
  type Session
} from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/shared/database/connection';
import { users } from '@/shared/database/schemas';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        // 1. Check how many users exist
        const [{ count: userCount }] = await db
          .select({ count: count() })
          .from(users);

        // 2. If table is empty → create first user on the fly
        if (Number(userCount) === 0) {
          const passwordHash = await bcrypt.hash(password, 12);
          const [newUser] = await db
            .insert(users)
            .values({
              email,
              name: email.split('@')[0],
              passwordHash,
              role: 'admin'
            })
            .returning();

          return { id: newUser.id, name: newUser.name, email: newUser.email };
        }

        // 3. Normal login path
        const user = await db.query.users.findFirst({
          where: eq(users.email, email)
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        return ok ? { id: user.id, name: user.name, email: user.email } : null;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: false
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true
};

export default NextAuth(authOptions);
