import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login"]);

// Demo mode: when the app is running on pretend data there is no real account
// to check, so this guard steps aside and lets every page through. That is what
// makes the clickable prototype (including the mock sign-in screens under
// /auth) viewable without a real Supabase login.
//
// Note the deliberately strict comparison: protection only switches off when
// this setting is exactly the word "true". Any other value -- including the
// setting being missing entirely, as it would be on a fresh deployment where
// someone forgot to add it -- leaves the real protection switched ON. Getting
// this backwards would silently expose every page, so it fails safe.
const DEMO_MODE = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function proxy(request: NextRequest) {
  if (DEMO_MODE) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() revalidates the token against Supabase rather than just
  // trusting whatever is in the cookie, unlike getSession().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.has(pathname);

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except:
     * - _next/static, _next/image (build assets)
     * - favicon.ico and other static image files in /public
     * - /api/auth/send-otp (must be reachable pre-login to send the OTP)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth/send-otp|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
