
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/shared/database/connection';
import { users } from '@/shared/database/schemas';
import { eq, count } from 'drizzle-orm';

// NextAuth configuration with Credentials provider and auto-provisioning of the first user
const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
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
              role: 'admin',
            })
            .returning();

          return { id: newUser.id, name: newUser.name, email: newUser.email };
        }

        // 3. Normal login path
        const user = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        return ok ? { id: user.id, name: user.name, email: user.email } : null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    }
  },
  pages: { signIn: '/login' }
};

// Direct NextAuth initialization
const nextAuth = NextAuth(authConfig);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
