# Contributing

Developer guide for the **CareerBridge web** app.

> Documentation convention: this guide is tool-agnostic. No editor- or AI-assistant-specific instructions.

---

## 1. Project Overview

CareerBridge is a job-matching platform connecting students with employers. This package (`apps/web`) is the **Next.js frontend** in the CareerBridge monorepo.

The backend API lives in a sibling workspace (`apps/api`, NestJS + Prisma) and is consumed via the typical workspace dev scripts.

---

## 2. Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4
- **State:** Zustand
- **Data fetching:** TanStack Query
- **Forms:** React Hook Form + Zod resolvers
- **UI primitives:** Radix UI Slot + shadcn-style components
- **Animations:** Framer Motion / Motion
- **Theming:** `next-themes` (light/dark)

---

## 3. Project Structure

```text
src/
  app/          # App Router
    admin/        # Admin area
    auth/         # Login, register, sessions
    employer/     # Employer-facing screens
    employers/    # Public employer listings
    student/      # Student-facing screens
    students/     # Public student listings
    how-it-works/ # Marketing / explainer
    trust/        # Marketing / trust signals
    layout.tsx    # Root layout (providers, theme)
    page.tsx      # Landing page
    providers.tsx # Client-side providers (theme, query client)
  components/   # Shared UI components
  lib/          # Utilities, API client, helpers
public/         # Static assets
```

---

## 4. Development Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install (from monorepo root)

```bash
npm install
```

### Run web only

```bash
npm run dev --workspace apps/web
# or from monorepo root
npm run dev:web
```

App runs on `http://localhost:3000`.

### Run web + API together (typical local flow)

From monorepo root, in two terminals:

```bash
npm run dev:api       # backend (Nest + Prisma, see apps/api)
npm run dev:web       # this app
```

### Commands (from this package)

| Command | Description |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript no-emit check |

---

## 5. Coding Conventions

- TypeScript strict mode; avoid `any` unless documented
- Server components by default; `"use client"` only where interactivity is required
- Forms: React Hook Form + Zod schemas co-located with the form component
- State: Zustand stores per feature, no global god store
- Server state: TanStack Query for any API-bound data
- Tailwind utility-first; reusable patterns live in `src/components/`
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`, `test:`, `perf:`, `security:`

---

## 6. Workflow

- Direct commits to `master` (solo development)
- Run `npm run lint` and `npm run typecheck` before pushing non-trivial changes
- Keep commits small and scope-focused

---

## 7. Architecture Notes

### Routing

App Router-based. Two parallel hierarchies for each role:

- **`/employer/*`** and **`/student/*`** — authenticated, role-scoped screens
- **`/employers/*`** and **`/students/*`** — public, marketing-style listings

### Theming

`next-themes` provides light/dark switching. Theme is provided in `src/app/providers.tsx`.

### Data Layer

TanStack Query is initialized in `src/app/providers.tsx`. Query keys and hooks live alongside their feature in `src/components/` or `src/lib/`.

### Next.js Version Note

The pinned Next.js version (16.x) introduces breaking changes compared to older majors — APIs, conventions, and file structure may differ from older tutorials. When in doubt, consult `node_modules/next/dist/docs/` for version-specific guides. See [`AGENTS.md`](./AGENTS.md) for a brief reminder.
