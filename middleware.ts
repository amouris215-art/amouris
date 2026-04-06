import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // why your multi-factor authentication is not working.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  if (user) {
    // Check if user has a profile with specific role/status
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    // 1. Check for frozen account
    if (profile?.status === 'frozen') {
      // Sign out and redirect to login with error
      await supabase.auth.signOut();
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'frozen');
      return NextResponse.redirect(loginUrl);
    }

    // 2. Protect /admin routes - must be admin
    if (url.pathname.startsWith('/admin') && !url.pathname.includes('/login')) {
      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // 3. Prevent logged-in users from hitting login/register pages
    if (url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/admin/login') {
      const redirectUrl = profile?.role === 'admin' ? '/admin/overview' : '/account';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } else {
    // No user session
    // Redirect /admin to /admin/login
    if (url.pathname.startsWith('/admin') && !url.pathname.includes('/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Redirect /account to /login
    if (url.pathname.startsWith('/account')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse;
}

export const middleware = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
