export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - images, public assets (e.g. /images/background.jpg, /placeholder.svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|images|.*\\.svg$|.*\\.jpg$).*)'
  ]
};
