# Quick Start — Deploy in 5 Minutes

## 1. Get Your Keys (2 min)

### Supabase
1. Go to https://supabase.com → Your Project
2. Click **Settings → API**
3. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Gemini
1. Go to https://aistudio.google.com/apikey
2. Click **Get API key → Create API key in new project**
3. Copy key → `GOOGLE_GEMINI_API_KEY`

## 2. Run SQL Migrations (1 min)

1. In Supabase: **SQL Editor → New Query**
2. Copy entire `migrations/001_initial_schema.sql`
3. Paste and **Execute**
4. Wait for success (creates 9 tables)

## 3. Set Environment Variables (1 min)

### On Vercel
1. Go to your project → **Settings → Environment Variables**
2. Add 5 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = <from step 1>
   NEXT_PUBLIC_SUPABASE_ANON_KEY = <from step 1>
   SUPABASE_SERVICE_ROLE_KEY = <from step 1>
   GOOGLE_GEMINI_API_KEY = <from step 1>
   GOOGLE_GEMINI_MODEL = gemini-2.0-flash
   ```
3. Save

### Locally (for testing)
Create `.env.local` in project root with same 5 variables

## 4. Deploy (1 min)

```bash
git add .
git commit -m "Deploy: Add Supabase sync, AI assistant, PWA"
git push origin main
```

Vercel auto-deploys. Wait 2-3 min for build to complete.

## 5. Test Everything (optional, but recommended)

✓ **Backup export:** Go to `/backup` → Export → Check JSON has 15 keys  
✓ **AI assistant:** Click ✨ → Type "What should I study?" → Should respond  
✓ **PWA:** On mobile, you should see "Install Personal OS" prompt  
✓ **Offline:** DevTools → Offline → Page should still load

---

## Done! 🎉

Your Personal OS now has:
- ☁️ Cloud sync (all data syncs to Supabase)
- 🤖 AI assistant (15 requests/day, free)
- 📱 PWA (works offline, installable)
- ✅ Fixed backup (all 15 data types saved)

**Questions?** See `DEPLOYMENT.md` for full guide.
