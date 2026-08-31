# Personal OS — Shared Vocabulary

**Last updated:** 2026-08-31  
**Owner:** Guru Govind (student, personal use)

---

## Project Identity

**Personal OS** is a personal study & focus companion web app. It's built for Guru's own daily use to help with:
- Academic focus and study organization
- Learning by building (learning full-stack web development)
- Personal productivity and time management

**Scope:** Solo personal project (may later share with friends for feedback, but core intent is self-use only).

---

## Core Features

The app contains 15+ data types that sync to Supabase:
- **Study Core:** Tasks, Notes, Resources, Study Sessions, Recall History
- **Planning:** Goals, Habits, Timetable, Daily Reviews
- **Support:** Exam tracking, Flashcards, Media library, Analytics
- **AI:** Assistant widget (Gemini-powered chat)
- **Export:** Full backup export to JSON

---

## Key Design Decisions

### AI Assistant
- **Current:** Gemini API (no request limit enforced, visual "15/day" is placeholder)
- **Not locked into Gemini:** Open to Claude, OpenAI later if needed
- **Intent:** Helper for study questions, not multi-provider swap-out (too complex for solo project)

### Cloud Sync
- **Database:** Supabase (PostgreSQL + RLS policies)
- **User Authentication:** Email/password via Supabase Auth
- **Fallback:** localStorage (works offline, syncs when back online)
- **Data Ownership:** All data is Guru's; no sharing/collaboration features planned yet
- **Privacy:** Personal use only; future sharing is read-only links to friends (not real-time sync)

### Deployment
- **Hosting:** Vercel (auto-deploys from main branch)
- **Domain:** Personal use (no commercial plans)

---

## Not Decided Yet

- **App Name:** "Personal OS" is a working title; open to rename if something fits better
- **Share Model:** Currently solo project; if sharing happens, TBD whether it's:
  - Static export/snapshot links
  - Read-only guest views
  - Real-time collaboration (unlikely — adds complexity)

---

## Development Intent

Build this as a **real product for personal use**, not a toy. Guru is learning full-stack development while solving their own problems. Quality matters because it's self-use.

---

## What This Is NOT

- Not a SaaS startup or multi-user platform
- Not a study app for distribution (no app store plans)
- Not locked into Gemini forever
- Not requiring friends to sign up to give feedback

