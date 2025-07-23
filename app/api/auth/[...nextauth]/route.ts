import NextAuth from '@/shared/lib/auth.server';

const handler = NextAuth;

export { handler as GET, handler as POST };
