import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_ID_COOKIE, isDemoAuthEnabled } from "@/lib/auth/demo-mode";
import {
  resolveSupabaseAnonKey,
  resolveSupabaseUrl,
} from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/app"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  if (!isProtected) return response;

  if (isDemoAuthEnabled() && request.cookies.get(DEMO_ID_COOKIE)?.value) {
    return response;
  }

  const url = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = resolveSupabaseAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const login = new URL("/auth/login", request.url);
  login.searchParams.set("next", path);
  if (!url || !key) {
    return NextResponse.redirect(login);
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
