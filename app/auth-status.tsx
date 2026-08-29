"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase-browser";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const client = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    if (!client) return;
    void client.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => setEmail(session?.user?.email ?? null));
    return () => listener.subscription.unsubscribe();
  }, [client]);

  if (!email) return <a href="/login">Sign in</a>;
  return <span className="auth-status"><small>{email}</small><button onClick={() => void client?.auth.signOut().then(() => { window.location.href = "/login"; })}>Log out</button></span>;
}
