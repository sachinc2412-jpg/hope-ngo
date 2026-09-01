# Hope NGO — Day 1 (Foundations)

Next.js 16 (App Router) · TypeScript strict · Tailwind 4 · ESLint · Prettier · self-hosted variable fonts.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```
Other scripts: `npm run build`, `npm run lint`, `npm run format`.

## What Day 1 delivered
- Scaffold: Next 16 App Router, TS strict, Tailwind 4 (CSS-first tokens in `src/app/globals.css`).
- Fonts: Fraunces (display) + Inter (sans) **self-hosted** via `next/font/local` — no Google request at build or runtime (GDPR + perf). Files in `src/app/fonts/`.
- Design tokens seeded (color/font/radius) as Tailwind utilities.
- `.env.example` with security notes; `.env.local` is gitignored.
- Placeholder homepage that only proves fonts + tokens + build. It gets replaced Days 5–8.

## The two steps only you can do (Day 1 DoD)

### 1. Push to GitHub
```bash
git init && git add -A && git commit -m "Day 1: foundations"
git branch -M main
git remote add origin git@github.com:<you>/hope-ngo.git
git push -u origin main
```
(A `git` repo may already be initialized by create-next-app — if so, skip `git init`.)

### 2. Deploy to Vercel
- vercel.com → New Project → import the repo → deploy. Framework auto-detected.
- No env vars needed yet (nothing consumes them until Day 3+).
- **Day 1 DoD is met when:** the Vercel preview URL loads and the serif headline + sans body render with no flash of fallback font.

## Next: Day 2 — design system + layout shell (Header, Footer, MobileNav, DonateBar).
