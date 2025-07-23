'use server';

import { redirect } from 'next/navigation';

export async function signOutAction() {
  // В NextAuth 4 для серверного выхода нужно использовать API route
  // Перенаправляем на API route для выхода
  redirect('/api/auth/signout?callbackUrl=/login');
}
