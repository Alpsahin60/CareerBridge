# CareerBridge

A Next.js frontend MVP for **CareerBridge** — a Swiss-only, verified early tech talent network. Students become discoverable through real, verifiable work samples; employers see structured evidence and verification context instead of CV-only signals.

> **Status:** Early-stage MVP, frontend only. The backend API consumed by the protected workspaces is **not part of this repository** and must be provided separately (see [Backend dependency](#backend-dependency)). The public marketing pages render without a backend.

---

## Features

The features below correspond to routes and components that actually exist in `src/`.

### Public marketing (no backend required)
- Landing page (`/`) with hero, problem framing, value proposition, FAQ and CTAs
- Static sub-pages: `/how-it-works`, `/trust`, `/employers`, `/students`
- Light/dark theming via `next-themes`
- Subtle scroll-reveal animations via Framer Motion

### Authentication UI
- Sign-in / sign-up forms (`/auth/sign-in`, `/auth/sign-up`) built with React Hook Form + Zod
- Client-side session store via Zustand (`persist` middleware, key `careerbridge.auth`)
- Posts to `POST /auth/login` and registration endpoints on the configured API base URL

### Student workspace (`/student/*`, requires auth + backend)
- Dashboard with profile strength signal
- Onboarding flow
- Profile editor (university, degree program, desired roles, regions, languages, work model, availability, links, visibility)
- Work submissions: list, create draft, edit (`/student/work`, `/student/work/new`, `/student/work/[id]`)
- Verification request management (`/student/verification`)
- Visibility settings (`/student/visibility`)
- Notifications (`/student/notifications`)
- Inbound employer contact requests (`/student/interest`)

### Employer workspace (`/employer/*`, requires auth + backend)
- Dashboard linking discovery → saved → pipeline → messages
- Discovery view with search, work-type filter and "verified only" filter (`/employer/discovery`)
- Bookmarks / saved candidates with stages (`/employer/saved`)
- Pipeline view (`/employer/pipeline`)
- Verification / interest requests (`/employer/requests`)
- Messages (`/employer/messages`)

### Admin
- Read-only overview page (`/admin/overview`)

### Shared UI
- shadcn-style primitives in `src/components/ui/` (`Button`, `Card`, `Input`, `Textarea`, `Progress`) built with `class-variance-authority` and Radix Slot
- Verification badge and timeline components in `src/components/trust/`
- Protected app shell with sidebar navigation and auth guard (`src/components/app/protected-app-shell.tsx`)

---

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) on **React 19**
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 with CSS variables / design tokens in `src/app/globals.css`
- **Forms:** `react-hook-form` + `zod` + `@hookform/resolvers`
- **State (client):** `zustand` (with `persist` for the auth session)
- **State (server):** `@tanstack/react-query` + devtools
- **UI primitives:** `@radix-ui/react-slot`, `lucide-react`
- **Animation:** `framer-motion`
- **Theming:** `next-themes`
- **Tooling:** ESLint 9 (`eslint-config-next`), TypeScript no-emit check

See `package.json` for exact versions.

---

## Setup / run locally

### Prerequisites
- Node.js 20+
- npm 10+

### Install and run
```bash
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Available scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |

### Environment variables

Create `.env.local` in the project root if you need to point at a non-default backend:

```env
# Base URL of the CareerBridge backend API
# Default if unset: http://localhost:4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

The only environment variable consumed is `NEXT_PUBLIC_API_BASE_URL` (see `src/lib/env.ts`).

### Backend dependency

The protected workspaces (`/student/*`, `/employer/*`, `/admin/*`) and the auth forms call a REST API at `NEXT_PUBLIC_API_BASE_URL`. The expected endpoints include, among others:

- `POST /auth/login`
- `GET/PUT /student/profile`
- `GET/POST/PATCH /student/works`, `GET /student/works/:id`
- `POST /student/works/:id/verification-requests`, `GET /student/works/verification-requests`
- `GET /employer/discovery/works`
- `GET/POST/PATCH/DELETE /employer/bookmarks/:workId`
- `GET/POST /employer/interest/:workId`
- `GET /employer/notifications`, `PATCH /employer/notifications/:id/read`

**This backend is not contained in this repository.** Without it, the marketing pages still render, but the auth and workspace screens will fail on the network calls.

---

## Project structure

```text
src/
  app/                       # Next.js App Router
    layout.tsx               # Root layout, fonts, providers
    page.tsx                 # Landing page
    providers.tsx            # TanStack Query client provider
    globals.css              # Tailwind v4 + design tokens
    auth/
      sign-in/page.tsx
      sign-up/page.tsx
    how-it-works/page.tsx    # Marketing
    trust/page.tsx           # Marketing (verified-work explainer)
    employers/page.tsx       # Public employer-facing marketing page
    students/page.tsx        # Public student-facing marketing page
    employer/                # Protected employer workspace
      layout.tsx
      page.tsx               # Dashboard
      discovery/page.tsx
      saved/page.tsx
      pipeline/page.tsx
      requests/page.tsx
      messages/page.tsx
    student/                 # Protected student workspace
      layout.tsx
      page.tsx               # Dashboard
      onboarding/page.tsx
      profile/page.tsx
      work/page.tsx
      work/new/page.tsx
      work/[id]/page.tsx
      verification/page.tsx
      visibility/page.tsx
      notifications/page.tsx
      interest/page.tsx
    admin/
      overview/page.tsx
  components/
    app-shell.tsx            # Marketing shell (header, nav)
    theme-provider.tsx       # next-themes wrapper
    app/                     # Auth-guarded shell
    auth/                    # Sign-in / sign-up forms
    landing/                 # Section, Reveal, FAQ
    trust/                   # Verification badge / timeline
    ui/                      # Button, Card, Input, Textarea, Progress
  lib/
    api.ts                   # apiFetch wrapper + ApiError
    env.ts                   # NEXT_PUBLIC_API_BASE_URL
    auth-store.ts            # Zustand session store
    cn.ts                    # className helper
    student-api.ts           # Student profile API
    work-api.ts              # Work submissions + verification requests
    student-engagement-api.ts
    student-dashboard-strength.ts
    employer-discovery-api.ts
    employer-workspace-api.ts
    reference-api.ts
    work-types.ts
public/                      # Static SVG assets
```

---

## Screenshots

<!--
TODO: Add screenshots once the UI is stable. Suggested layout:
- docs/screenshots/landing.png         -> Landing page (/, light + dark)
- docs/screenshots/student-dashboard.png  -> Student workspace dashboard (/student)
- docs/screenshots/student-work-new.png   -> Work submission form (/student/work/new)
- docs/screenshots/employer-discovery.png -> Discovery view (/employer/discovery)
- docs/screenshots/employer-pipeline.png  -> Pipeline view (/employer/pipeline)
- docs/screenshots/trust.png              -> Verified Work explainer (/trust)

Embed example:
![Landing page](docs/screenshots/landing.png)
-->

---

## Status / TODO

Honest snapshot of what is and isn't done in this repository.

**Done in this repo**
- Landing page and public marketing routes (`/`, `/how-it-works`, `/trust`, `/employers`, `/students`)
- App Router structure with role-scoped layouts and an auth-guarded shell
- Sign-in / sign-up forms with Zod validation and Zustand-persisted access token
- Typed API client wrapper (`apiFetch`) with structured `ApiError`
- All protected workspace screens listed under [Features](#features) are scaffolded with TanStack Query integration points
- Design tokens for light/dark theming and a small reusable UI kit

**Not in this repo / known gaps**
- **No backend:** the consumed REST API is external; this repo cannot run an end-to-end flow on its own.
- **No automated tests yet** (no unit, integration or E2E tests configured).
- **Public listing pages** (`/employers`, `/students`) are intentionally minimal placeholders.
- **Admin area** is limited to a single overview page.
- **Auth hardening:** the access token is stored in `localStorage` via Zustand `persist`; this is sufficient for an MVP but is not a long-term auth strategy. No refresh-token flow is implemented client-side.
- **No CI** configuration is checked in.
- **Marketing partners and metrics** shown on the landing page are placeholders (clearly labelled as such in the UI).

**Next steps**
- Wire the workspace screens against a running backend and verify all listed endpoints
- Add Vitest + React Testing Library and cover the auth forms and the API client first
- Replace `localStorage` token persistence with a more robust auth flow once the backend is finalised
- Add Playwright smoke tests against the landing page and the auth flow
- Add a CI workflow running `lint`, `typecheck` and (eventually) tests on push

---

## Contributing / developer guide

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for coding conventions, architecture notes and workflow.
