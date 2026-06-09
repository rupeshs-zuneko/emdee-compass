## EMDEE Pre-Sales CRM — Mobile-Style Web App

A mobile-framed web app (390px viewport, centered on a neutral page background) that simulates the Android CRM. Built on the existing TanStack Start + Tailwind v4 stack. Mock data only — no backend.

### Design system (from chosen "Notion Warm Organic" direction)
- Fonts: **Newsreader** (serif headings) + **Inter** (sans body), loaded via `<link>` in `__root.tsx`
- Surface `#fafaf9`, card `#fff`, ink `#18181b`, brand accent `#7c2d12`
- Rounded 20px cards, ring-1 black/5, soft shadows, generous whitespace
- Pill badges (uppercase tracking-tight, ring border, soft tinted bg) for stages / temperature / outcome — exact color tokens per spec
- Frosted bottom tab bar, dark circular FAB, dark primary buttons
- All screens rendered inside a `MobileFrame` component (390×844, rounded device chrome on desktop, full-screen on mobile)

### Routes (TanStack file-based)
```
src/routes/
  __root.tsx                  # font links, meta
  index.tsx                   # redirects to /login or /opportunities based on mock auth
  login.tsx                   # Screen 1
  _app.tsx                    # layout: MobileFrame + bottom tab nav + <Outlet />
  _app.opportunities.index.tsx       # Screen 2 — list
  _app.opportunities.new.tsx         # Screen 4 — create form
  _app.opportunities.$id.tsx         # Screen 3 — detail
  _app.opportunities.$id.edit.tsx    # Screen 4 — edit form
  _app.visits.index.tsx              # Screen 5 — list
  _app.visits.new.tsx                # Screen 7 — create form
  _app.visits.$id.tsx                # Screen 6 — detail
  _app.visits.$id.edit.tsx           # Screen 7 — edit form
  _app.profile.tsx                   # Screen 8
```

### Shared components (`src/components/ui-mobile/`)
- `MobileFrame` — device chrome, status bar, safe-area paddings
- `BottomTabBar` — Opportunities / Visits / Profile, active state via `useMatchRoute`
- `TopHeader` — title + optional back/save actions
- `Button` (primary / secondary / danger / ghost / loading / disabled)
- `Card` (default / opportunity / visit / form-section)
- `Badge` — `stage`, `temperature`, `outcome` variants with the color map from spec
- `TextInput` (label, helper, error, focused, disabled)
- `BottomSheetSelect` — picker for Temperature, Visit Type, Outcome, Source
- `SearchablePicker` — modal w/ search, recents, live results, empty state (Government Dept, District, Opportunity, Solution)
- `FAB`, `EmptyState`, `Skeleton`, `Loader`, `Chip` (filter)
- `PhotoGallery` (thumbs + lightbox), `GpsCaptureBlock` (mock "Capture Location" with fake coords + Open in Maps link)

### Mock data layer (`src/lib/mock/`)
- In-memory arrays for `opportunities`, `visits`, `contacts`, `solutions`, `departments`, `districts`, `currentUser`
- Tiny store using Zustand (already friendly to add) or a plain module-level store + `useSyncExternalStore`; pick Zustand for simpler subscribe + persist to `localStorage` so created/edited records survive reload
- Helper functions: `listOpportunities`, `getOpportunity`, `createOpportunity`, `updateOpportunity`, `transitionStage`, same for visits
- Seed with ~8 opportunities across all stages, ~6 visits across outcomes
- Mock auth: `login(email, password)` — any non-empty creds succeed except `wrong@test.com` (returns "Invalid email or password.")

### Screen-by-screen scope
1. **Login** — EMDEE "E" logo (SVG), title, subtitle, email/password inputs, show/hide toggle, primary button with loading state, inline error.
2. **Opportunities List** — header, search, horizontally scrolling stage chips (all 8), opportunity cards, FAB → `/opportunities/new`, tabs.
3. **Opportunity Detail** — header w/ badges, Details / Solutions / Budget / Visits sections, contextual workflow action buttons based on current stage, bottom action bar with `Log Visit` + `Edit`.
4. **Opportunity Form** — shared component for new/edit, top Save, all fields per spec, `+ Add Solution` opening searchable picker, inline validation.
5. **Visits List** — date chips + outcome chips, visit cards, FAB → `/visits/new`.
6. **Visit Detail** — sections per spec; if linked opportunity missing, show `Create Opportunity` action.
7. **Visit Form** — full form, GPS capture block (mocked w/ random coords on click), Contacts Met w/ new-contact modal, Solutions Discussed, Photos (file input → object URLs).
8. **Profile** — avatar, user info, app version, primary Log Out button.

### Workflow actions (Screen 3)
Stage-driven contextual buttons mutate the mock store and re-render. Implements: Pitch / Confirm Interest / Mark Tender Expected / Release Tender / Hand Over to CRM / Drop Deal. No delete anywhere.

### Loading & empty states
- Skeleton cards on list screens (200ms artificial delay so they're visible)
- Empty states for: No Opportunities, No Visits, No Search Results — each with an illustrated SVG and a CTA button

### Out of scope (per user)
- Real backend / Frappe integration
- Real GPS, real camera, real auth
- Push notifications, offline sync
- Reports, dashboards, admin, delete actions

### Technical notes
- Tailwind v4 tokens added to `src/styles.css` under `@theme` (brand, surface, card, ink, stage/temperature/outcome palettes). Fonts loaded via `<link>` in `__root.tsx`, never `@import`.
- `MobileFrame` enforces 390px width on `md+` screens with device chrome; on small screens it goes edge-to-edge.
- Bottom tab nav uses TanStack `<Link>` with `activeProps`.
- Forms use `react-hook-form` + `zod` (already in shadcn template) for validation.
- `index.tsx` reads mock-auth from `localStorage` and redirects via `<Navigate>` to `/login` or `/opportunities`.
