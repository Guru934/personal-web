import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: values => { values.forEach(({ name, value, options }) => { request.cookies.set(name, value); response.cookies.set(name, value, options); }); } } });
  const { data: { user } } = await supabase.auth.getUser();
  // Make the deployed homepage the auth entry point. Once the callback has
  // stored a Supabase session cookie, the same URL loads the dashboard.
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  return response;
}

export const config = { matcher: ["/", "/analytics", "/backup", "/daily-review", "/exam", "/flashcards", "/formulas", "/goals", "/habits", "/media", "/recall", "/resources", "/settings", "/study", "/subjects", "/timetable", "/auth/update-password"] };
