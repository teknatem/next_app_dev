/**
 * @id W-003 UserProfileMenu
 * @layer widgets
 * @summary Dropdown with avatar and profile actions
 */

import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

import { auth, signOut } from '@/shared/lib/auth';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';


/**
 * User Profile Menu Component
 *
 * A server component that renders a dropdown menu for user profile management.
 * Displays user avatar, account options, and authentication controls.
 *
 * @async
 * @function UserProfileMenu
 * @returns {Promise<JSX.Element>} The rendered user profile menu component
 *
 * @example
 * ```tsx
 * import { UserProfileMenu } from '@/widgets/user-profile-menu/ui/user-profile-menu';
 *
 * export default function Header() {
 *   return (
 *     <header>
 *       <UserProfileMenu />
 *     </header>
 *   );
 * }
 * ```
 *
 * @description
 * This component:
 * - Fetches the current user session using NextAuth
 * - Displays user avatar with fallback to placeholder image
 * - Provides dropdown menu with account options
 * - Handles sign out with server action and page revalidation
 * - Shows sign in link for unauthenticated users
 *
 * @see {@link https://next-auth.js.org/configuration/nextjs#middleware NextAuth.js Documentation}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/revalidate-path revalidatePath Documentation}
 */
export async function UserProfileMenu() {
  const session = await auth();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user?.image ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
                revalidatePath('/');
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
