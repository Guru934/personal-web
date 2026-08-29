"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase-browser";
import "../../login/login.css";

export default function UpdatePasswordPage() {
  const router = useRouter(); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); const client = createSupabaseBrowserClient(); const result = client ? await client.auth.updateUser({ password }) : { error: { message: "Supabase is not configured." } }; setMessage(result.error?.message ?? "Password updated. You can sign in with it now."); if (!result.error) setTimeout(() => router.replace("/"), 900); setBusy(false); };
  return <main className="auth"><a href="/login">← Back to sign in</a><section><p>PERSONAL OS</p><h1>Choose a new password</h1><span>Use at least 6 characters.</span><form onSubmit={submit}><label>New password<input type="password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)}/></label><button disabled={busy}>{busy ? "Saving..." : "Update password"}</button></form>{message && <p className="message">{message}</p>}</section></main>;
}
