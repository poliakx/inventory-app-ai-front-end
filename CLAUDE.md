# Inventory App Frontend — AI Context

## Project
React/Vite frontend for Kitchen OS — SaaS for restaurant kitchen management.

- Full product context (features, roadmap, roles): `../product/PRODUCT_SPEC.md`
- Backend counterpart: `../inventory-app-back-end/CLAUDE.md`
- New ideas / backlog: `../product/IDEAS.md`

Read PRODUCT_SPEC.md when the conversation is about *what* to build, not *how*.

---

## Stack
React 18 + Vite · React Router v6 · TanStack Query · Zustand · shadcn/ui + Tailwind · Axios + interceptors · React Hook Form + Zod

## Project Structure — feature-based
```
src/
  features/<domain>/   (page, service, query hooks — colocated)
  components/ui/        (shadcn primitives, truly shared only)
  components/layouts/
  lib/                   (api.js axios instance, utils.js — shared infra)
```
Default new files to `src/features/<domain>/`. Only put something in `components/` or `lib/` if it's genuinely shared across multiple features.

## AI Collaboration Mode
Do **not** write code for me for logic — hooks, state, data flow, validation, JSX structure. Explain the concept and what needs to happen, wait for me to write it, then review: what's good, what's not, why.

**Exception — visual design/styling (Tailwind classes, spacing, colors, layout wrappers):** write it directly, don't make me write it myself. Design is not my learning focus and I'm weak at it (same reasoning as the backend exception below) — don't waste review cycles on it. Still point out *what* pattern you copied from (e.g. "matched ProductsPage's table styling") so I can follow along, but no need to wait for me to type the classes myself.

**Exception — small mechanical shared components (e.g. `FieldError`, other tiny reusable primitives that are pure boilerplate reduction, not a new concept):** write these directly too, same as design. Treat them like `Label`/`Input`/`Button` — vendored building blocks, not something I need to hand-write to learn from. Still explain what it does and why it's shared. Core form/data logic (hooks, state, validation rules, data flow) stays explain-and-wait, no exceptions there.

Frame explanations against my backend knowledge when useful (e.g. "this is like Express middleware").

**Before every commit:** run a 2-3 question quiz on the code just written, one question at a time. After the quiz, give a short assessment — what I understood well, what needs reinforcement, confidence level for this topic. Commit only after the quiz is done.

## Known Recurring Mistakes
_(watch for these, calibrate review depth accordingly — update as patterns change)_

- Calling a hook/function instead of passing a reference (`mutationFn: fn(x)` instead of `mutationFn: fn`)
- Incomplete rename after refactor — fixes most occurrences, misses one
- File naming inconsistency: singular vs plural (`product.x.js` vs `products.x.js`)
- Genuinely shaky spots: `useState` vs `useQuery` mental model, `queryKey` as an arbitrary cache label (not a URL), why `useEffect` wraps side effects instead of inlining

## Deployment
- Vercel, Git import, auto-deploys on push to `main`
- Custom domain: getkitchenos.app (fallback: inventory-app-ai-front-end.vercel.app)
- `src/lib/api.js` baseURL reads `VITE_API_URL`, falls back to `/api` locally
- CORS is backend-side (`back-end/src/config/cors.js`) — new preview URLs need the regex pattern there, not here

## Current Priorities
1. Close out remaining Phase 0 polish items (see PRODUCT_SPEC.md roadmap)
2. Recipes frontend — backend is done and tested (`back-end` repo, branch `chore/update-readme`; see `../product/RECIPES_FRONTEND_BRIEF.md` for full handoff context). Starting now.

## End of Session Checklist

Перед тим як вважати фічу/сесію завершеною, пройди по пунктах і коротко звітуй що саме оновив (або що оновлювати не було потреби):

1. Known Open Issues (цей файл) — чи закрились якісь пункти? Чи з'явились нові проблеми, які варто зафіксувати?
2. PRODUCT_SPEC.md — чи змінився статус модуля (не почато → в процесі → готово)? Онови одним реченням, якщо так.
3. IDEAS.md — чи виникли думки/питання під час роботи, які не стосуються поточної задачі? Запропонуй додати, не додавай сам без підтвердження.
4. Якщо це backend і зʼявився security-момент — переконайся, що він позначений `[BLOCKER]`, а не загублений в тексті.

Не редагуй SPEC/IDEAS без мого explicit "так" — тільки пропонуй конкретну правку одним реченням, я підтверджую.
