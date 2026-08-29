import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/") ? next : "/";
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if ((code || tokenHash) && url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Cookies can be read-only in some server rendering contexts.
          }
        },
      },
    });

    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : tokenHash && type
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type.trim() as "signup" | "recovery" | "invite" | "email_change" | "magiclink" })
        : { error: new Error("Missing authentication code") };
    if (!error) return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", requestUrl.origin));
}
