/**
 * @id W-003 UserProfileMenu
 * @layer widgets
 * @summary Dropdown with avatar and profile actions
 * @description Server component that renders a dropdown menu for user profile management. 
 * Displays user avatar with fallback image, account settings, support links, 
 * and authentication controls (sign in/out). Uses NextAuth for session management 
 * and server actions for sign out functionality with page revalidation.
 */

export { UserProfileMenu } from './ui/user-profile-menu'; 