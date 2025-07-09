import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/shared/database/connection';
import { users } from '@/shared/database/schemas';
import { eq, count } from 'drizzle-orm';
import { authConfig } from './auth.config';

// Direct NextAuth initialization
const nextAuth = NextAuth({
  ...authConfig,
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
  ]
});

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
