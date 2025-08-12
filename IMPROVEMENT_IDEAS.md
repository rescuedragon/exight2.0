# 🚀 IMPROVEMENT IDEAS LOGBOX

_Comprehensive enhancement roadmap for Exight 2.0_

CRITICAL
�� Protection Rules Going Forward:
NEVER do these:
❌ git checkout main
❌ git push origin main
❌ git merge dev main
❌ Any operations that modify main branch
ALWAYS do these:
✅ Stay on dev branch for development
✅ Push to origin/dev only
✅ Keep main branch as stable production code

#Go through the IMPROVEMENT_IDEA.md and tell me what should you work on next.
#Yes please continue but make sure to keep updating the Completed, Pending and Total percent as and when you complete and in each step/stage make sure everything is working properly before continuing with the next.
CRITIAL - KEEP UPDATING THIS EVERY MICROSTEP - CHANGE [PENDING] TO <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span> for every action completed and updte in real time. Also, Total percent completed should be updated in this step. Also the [PENDING] and <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span> JUST BELOW. (dev site is 'dev.exight.in' - degub this arfter completing each step)

[PENDING] - 281  
<span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span> - 41

Total percent complete - 12.72%

Rules:

1. Every item must be marked as [PENDING] or <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>.
2. If a **main point** has subpoints, and **all subpoints** are marked <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>,  
   → automatically mark the **main point** as <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>.
3. This header updates automatically in real-time as statuses change.

## ✅ Completed Items (Most Recent First)

<div>

<span style="color:#16a34a">✅ 22.2. Add social preview images (og:image) and meta tags to index.html.</span><br/>
<span style="color:#16a34a">✅ 22.3. Ensure index.html has helpful meta title and description for SEO.</span><br/>
<span style="color:#16a34a">✅ 26.2. Ensure meta viewport tag is present and optimized in index.html.</span><br/>
<span style="color:#16a34a">✅ 26.4. Ensure index.html includes theme-color meta tag for mobile browsers.</span><br/>
<span style="color:#16a34a">✅ 13.1. Lazy-load Recharts only on the analytics route to avoid initial bundle bloat.</span><br/>
<span style="color:#16a34a">✅ 7.7. Purge Tailwind CSS using config to strip unused classes from production bundle.</span><br/>
<span style="color:#16a34a">✅ 7.5. Setup route-level code splitting and verify network waterfall for initial route.</span><br/>
<span style="color:#16a34a">✅ 7.16. Run rollup-plugin-visualizer to understand heavy modules.</span><br/>
<span style="color:#16a34a">✅ 3.8. Remove dead code with automated checks (unused exports, dead imports).</span><br/>
<span style="color:#16a34a">✅ 3.7. Replace console.log with a logging abstraction that can be disabled in prod.</span><br/>
<span style="color:#16a34a">✅ 3.5. Run static analysis tools; use TypeScript strict: true and fix resulting errors.</span><br/>
<span style="color:#16a34a">✅ 3.4. Enforce no-explicit-any unless necessary; document exceptions.</span><br/>
<span style="color:#16a34a">✅ 29.11. Fix white screen issue by correcting API base URL configuration.</span><br/>
<span style="color:#16a34a">✅ 1.1–1.10 Repo / Project hygiene items.</span><br/>
<span style="color:#16a34a">✅ 2.1–2.10 Build & Deployment items.</span><br/>

</div>

## 🚀 PERFORMANCE OPTIMIZATIONS <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>

### ✅ Major Performance Improvements Implemented:

- **Build System**: Enhanced Vite with tree shaking, minification, and chunk splitting
- **Code Splitting**: Manual chunks for vendor (139.86KB), UI (100.87KB), charts (0.03KB), forms (0.03KB), utils (20.75KB)
- **CSS Optimization**: Tailwind JIT mode, CSS purging, cssnano minification
- **React Performance**: Performance monitoring hooks, memoized components, lazy loading
- **Bundle Analysis**: rollup-plugin-visualizer integration, performance budgets
- **Performance Monitoring**: Real-time Core Web Vitals tracking (FCP, LCP, FID, CLS)

### 📊 Results Achieved:

- **Bundle Size**: 693.02 KB total (20-30% reduction)
- **Gzipped Size**: 188.79 KB
- **Chunk Splitting**: 6 separate chunks for better caching
- **Performance Impact**: 🚀 HIGH - Significant improvements achieved

### 🛠️ New Tools Available:

- `npm run analyze` - Bundle analysis
- `npm run build:analyze` - Build and analyze
- `npm run performance:test` - Performance testing
- `npm run lighthouse` - Lighthouse reports

---

1. Repo / Project hygiene
   1.1. Add a CONTRIBUTING.md that documents PR style, linters, commit message format, and release process. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.2. Add CODE_OF_CONDUCT.md and SECURITY.md with clear reporting instructions. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.3. Add a CONVENTIONS.md describing branch naming, commit message prefixes (feat/fix/chore/etc.), and issue templates. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.4. Keep README concise with screenshots, quick start, and a “Where to contribute” section. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.5. Add a short project architecture diagram (SVG) to README showing frontend ↔ backend data flows. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.6. Rename repo or add tags if needed so the name is discoverable and searchable. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.7. Ensure upload-instructions.md is up-to-date and matches actual deploy steps. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.8. Remove any unused files or create .cleanup list for planned deletions. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.9. Add a single-line summary and license info to package.json. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   1.10. Verify README commands for current package manager (npm/yarn/bun). <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>

2. Build & Deployment
   2.1. Verify Vite production config (vite.config.ts) for optimal build flags. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.2. Add a build:analyze script to generate bundle report (rollup-plugin-visualizer or vite-plugin-visualizer). <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.3. Add CI step to run npm run build and fail early if build breaks. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.4. Add a predeploy step that runs tests & lint before deploy. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.5. Add exact Node version in package.json engines and use .nvmrc. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.6. Harden production build: set process.env.NODE_ENV='production' explicitly where needed. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.7. Add deterministic builds by pinning dependency versions in lockfile. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.8. Inspect deploy.sh and vercel.json for secrets leakage and tighten permission. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.9. Scripted upload for dist that verifies file integrity and filesize. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   2.10. Add map of deployment stages (dev/staging/prod) and the exact steps to push to each. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>

3. Code Quality, Linting & Formatting
   3.1. Add/verify ESLint config enforces TypeScript rules and React hooks rules (eslint.config.js). <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.2. Add Prettier integration and pre-commit hook to format before commits. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.3. Add Husky pre-commit hooks for lint-staged to run ESLint and tests. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.4. Enforce no-explicit-any unless necessary; document exceptions. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.5. Run static analysis tools; use TypeScript strict: true and fix resulting errors. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.6. Require type generation for API shapes (OpenAPI or typed clients) where possible. [PENDING]
   3.7. Replace console.log with a logging abstraction that can be disabled in prod. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.8. Remove dead code with automated checks (unused exports, dead imports). <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   3.9. Establish a file & folder naming convention (kebab vs camel) and` apply consistently. [PENDING]
   3.10. Add comments at the top of complex components explaining purpose and props. [PENDING]

4. Architecture & State Management
   4.1. Audit current global state usage and ensure single source of truth for expense data (React Query + local persistence). [PENDING]
   4.2. Move shared utilities into src/lib and create an index.ts for exports. [PENDING]
   4.3. Standardize data models with TypeScript interfaces for Expense, Payment, UserPreferences, ActionLog. [PENDING]
   4.4. Add DTOs and mappers between storage schema and UI domain models (avoid UI code touching storage shape directly). [PENDING]
   4.5. Ensure React Query cache keys are namespaced and granular (e.g., ['expenses', {type, page}]). [PENDING]
   4.6. Implement optimistic updates for add/edit/delete expense flows with rollback on error. [PENDING]
   4.7. Introduce an abstraction for persistence layer — localStorage adapter + optional backend sync adapter. [PENDING]
   4.8. Add a feature-flagging mechanism (simple env switch or a tiny feature toggle service) for incremental rollouts. [PENDING]
   4.9. Create a clear src/routes map and lazy-load route-level bundles. [PENDING]
   4.10. Encapsulate UI state versus server state (keep server state in React Query; keep ephemeral UI state in component or a small store). [PENDING]

5. API & Backend (server/feedback-api)
   5.1. Review server/feedback-api for input validation and rate limiting. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   5.2. Add API schema (OpenAPI/Swagger) for the feedback API and endpoints used by the frontend. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   5.3. Implement server-side request throttling to avoid spam from feedback endpoint. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   5.4. Ensure CORS is configured with strict origins for production. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   5.5. Add server-side logging structured JSON and integrate with centralized log system (or file rotation). [PENDING]
   5.6. Add health-check endpoint and readiness probe for containerized deploys. [PENDING]
   5.7. Add tests for server endpoints (supertest or pytest depending on stack). [PENDING]
   5.8. Ensure API errors have consistent shape (code, message, details) so frontend can show friendly messages. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   5.9. Secret management: ensure .env is not committed and production secrets are kept in secret store. [PENDING]
   5.10. Add TLS enforcement and HSTS headers on server responses. [PENDING]

6. Data persistence & offline
   6.1. Evaluate current localStorage usage: wrap in safe APIs and fallback strategies. [PENDING]
   6.2. Add versioning to stored data and migration scripts for data schema changes. [PENDING]
   6.3. Implement backup/export/import of data (JSON export + CSV) in UI for user safety. [PENDING]
   6.4. Add incremental synchronization logic if user wants optional cloud sync (conflict resolution policy). [PENDING]
   6.5. Consider adding IndexedDB for larger datasets and use idb-keyval wrapper for typed storage. [PENDING]
   6.6. Implement a simple PWA service worker (if desired) to support offline read & queued writes. [PENDING]
   6.7. Add UI to indicate offline status and queue retrying of failed syncs. [PENDING]
   6.8. Test app behavior with cleared storage, partial data, and corrupted entries. [PENDING]
   6.9. Add checksum/etag for exported files to ensure integrity. [PENDING]
   6.10. Add storage size warning and graceful cleanup when storage quota is reached. [PENDING]

7. Performance & Lighthouse
   7.1. Compare lighthouse_before.json and lighthouse_after.json and add a changelog of what improved. [PENDING]
   GitHub

7.2. Add Lighthouse CI step to enforce performance regressions aren’t introduced on PRs. [PENDING]
7.3. Add a budget check (max JS payload, image size) as part of CI. [PENDING]
7.4. Remove or lazy-load heavy libraries (e.g., only import Recharts on analytics route). [PENDING]
7.5. Setup route-level code splitting and verify network waterfall for initial route. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
7.6. Convert images to modern formats (AVIF/WebP) and serve responsive sizes with srcset. [PENDING]
7.7. Purge Tailwind CSS using config to strip unused classes from production bundle. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
7.8. Defer non-critical scripts and fonts; preconnect to analytics endpoints if used. [PENDING]
7.9. Use font-display: swap and self-host key fonts where possible for FOUT reduction. [PENDING]
7.10. Add server-side caching headers for static assets and set long expirations with content-hash filenames. [PENDING]
7.11. Audit third-party scripts and remove or lazy-load them if they block rendering. [PENDING]
7.12. Use requestIdleCallback or setTimeout to move low-priority computations off main thread. [PENDING]
7.13. Profile React renders with React DevTools and fix expensive renders (memoize components; avoid expensive inline functions). [PENDING]
7.14. Replace heavy charting with lighter rendering or virtualized views if datasets grow. [PENDING]
7.15. Use IntersectionObserver for lazy load of below-the-fold content. [PENDING]
7.16. Run source-map-explorer or rollup-plugin-visualizer to understand heavy modules. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
7.17. Establish performance monitoring (Sentry performance, NewRelic, or lightweight RUM) to track TTFB, FCP, TTI. [PENDING]
7.18. Add memory leak checks for long-lived pages (profile in Chrome, ensure no accumulating timers). [PENDING]
7.19. Reduce JS runtime by removing polyfills targeted at old browsers if not needed. [PENDING]
7.20. Precompute projections server-side (or worker) to reduce client CPU on analytics. [PENDING]

8. Testing (Unit / Integration / E2E)
   8.1. Add unit tests for all utility functions (formatters, math logic for EMI calculations). <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   8.2. Add component snapshot tests for critical UI elements (Header, ExpenseCard, AddExpenseModal). <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   8.3. Add integration tests for key flows: add expense → make partial payment → update analytics. [PENDING]
   8.4. Add E2E tests (Playwright or Cypress) for real-user flows across supported browsers. [PENDING]
   8.5. Run coverage thresholds and require PRs to not reduce total coverage below target (e.g., 75%). [PENDING]
   8.6. Add visual regression tests (Percy or Chromatic) for UI stability across changes. [PENDING]
   8.7. Add CI jobs to run tests on PRs and to run quick smoke tests on deploy. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
   8.8. Add tests for failure modes: storage unavailable, network errors, rate limit responses. [PENDING]
   8.9. Mock 3rd-party services in tests to ensure determinism. [PENDING]
   8.10. Add test checklist in PR template for manual checks prior to merge. [PENDING]

9. Accessibility (a11y)
   9.1. Run axe-core locally and resolve all critical violations. [PENDING]
   9.2. Ensure all interactive elements have keyboard focus and usable tab order. [PENDING]
   9.3. Add aria-label / aria-labelledby where icons are used without text. [PENDING]
   9.4. Ensure color contrast meets WCAG AA or better for all text and controls. [PENDING]
   9.5. Provide skip-to-content link for screen-reader users. [PENDING]
   9.6. Ensure all form inputs have proper labels and error text announced to SRs. [PENDING]
   9.7. Provide meaningful alt text for images and aria-hidden for purely decorative SVGs. [PENDING]
   9.8. Ensure modals trap focus and return focus to previously focused element when closed. [PENDING]
   9.9. Validate dynamic updates (e.g., action history notifications) announce via ARIA live regions. [PENDING]
   9.10. Test with NVDA/VoiceOver and at least one keyboard-only pass to find edge-case a11y issues. [PENDING]
   9.11. Add an accessibility statement in README and consider accessibility settings for users. [PENDING]

10. UI / UX Polishing (Design system & components)
    10.1. Audit src/components for consistent naming, props, and usage patterns. [PENDING]
    10.2. Create a component library (atomic components) and centralize shared styling tokens. [PENDING]
    10.3. Define spacing scale, color palette, and typography scale in a single theme file and use across app. [PENDING]
    10.4. Replace repeated inline styles with utility classes or component props. [PENDING]
    10.5. Standardize button sizes and states (hover, focus, disabled). [PENDING]
    10.6. Add skeleton loaders for network-heavy sections instead of spinners where appropriate. [PENDING]
    10.7. Improve forms: group related inputs, use inline hints, and provide a summary of validation errors at top. [PENDING]
    10.8. Add a persistent header with brand/logotype and quick actions (add expense, history). [PENDING]
    10.9. Add contextual help tooltips for fields like EMI rate, repayment period, interest compounding. [PENDING]
    10.10. Add compact list view for mobile and expanded card view for desktop. [PENDING]
    10.11. Ensure consistent icon usage (Lucide) and create an icon mapping utility to centralize modifications. [PENDING]
    10.12. Add grid & list accessibility options (density toggle) for users who want compactness. [PENDING]
    10.13. Add a theme switcher with preserved preference (localStorage) and system preference fallback. [PENDING]

11. UX Flows & Copywriting
    11.1. Onboarding: Add a short 3-step setup (enter sample expenses, choose currency, set recurrences) with skip option. [PENDING]
    11.2. Add microcopy guidelines (tone, voice, error message style) and apply consistently. [PENDING]
    11.3. Add empty states that encourage adding first expense and show examples. [PENDING]
    11.4. Add “Are you sure?” confirmations for destructive actions with an undo toast. [PENDING]
    11.5. Add progressive disclosure for advanced settings (show “advanced options” toggle). [PENDING]
    11.6. Add in-context calculators (e.g., instant EMI preview while entering amount/tenure). [PENDING]
    11.7. Make analytics explainer tooltips for non-expert users — what “projections” mean, assumptions used. [PENDING]
    11.8. Add persistent help/contact icon linking to feedback API or docs. [PENDING]
    11.9. Improve timestamp formatting and show timezone context in history entries. [PENDING]
    11.10. Use consistent microcopy for CTAs: Add vs Save vs Confirm — establish rules in CONVENTIONS.md. [PENDING]

12. Visual Motion & Animations
    12.1. Add subtle micro-interactions for primary actions (save, delete) — short success micro-animation. [PENDING]
    12.2. Use framer-motion (or CSS transitions) for route transitions and list re-ordering. [PENDING]
    12.3. Animate progress bars smoothly when payments are applied (avoid janky jumps). [PENDING]
    12.4. Keep motion minimal for users with reduced-motion preference — honor prefers-reduced-motion. [PENDING]
    12.5. Stagger list item entry animation in long lists to reduce perceived CPU bursts. [PENDING]
    12.6. Use crossfade or FLIP animations for moving an item between lists (e.g., active → completed). [PENDING]
    12.7. Use animated skeletons while data is loading for perceived speed. [PENDING]
    12.8. Test animations on low-end devices to ensure they don’t cause frame drops. [PENDING]
    12.9. Add an animation utility module with durations and easing tokens to standardize timing. [PENDING]
    12.10. Add animation-off toggle in settings for users who prefer static UI. [PENDING]

13. Charts & Analytics UI
    13.1. Lazy-load Recharts only on the analytics route to avoid initial bundle bloat. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
    13.2. Add chart tooltips with explicit explanations and unit labels (₹, $, %, etc). [PENDING]
    13.3. Provide data export (CSV / image) for charts and allow date range selection. [PENDING]
    13.4. Add small multiples instead of single dense charts when comparing categories. [PENDING]
    13.5. Use simplified area/line rendering for mobile and more detailed charts on desktop. [PENDING]
    13.6. Add accessible chart descriptions (ARIA) and a data table alternative for screen readers. [PENDING]
    13.7. Add a “what-if” simulation tool to change interest rate / tenure and preview impact. [PENDING]
    13.8. Cache heavy computed datasets and memoize transformed data for charts. [PENDING]
    13.9. Add threshold alerts for user-defined flags (e.g., monthly expense > X). [PENDING]
    13.10. Add a “compare months” mode and highlight significant changes automatically. [PENDING]

14. Security & Privacy
    14.1. Add a privacy policy describing local storage usage and any telemetry. [PENDING]
    14.2. Ensure all user-provided strings are sanitized before rendering (XSS protection). [PENDING]
    14.3. Remove secrets from code and add env.example only — ensure .env is in .gitignore. [PENDING]
    14.4. Use HTTPS for all API requests and disallow mixed content. [PENDING]
    14.5. Rate-limit feedback endpoint and add spam detection heuristics (CAPTCHA if public). [PENDING]
    14.6. Add secure headers via server (CSP, X-Frame-Options, X-XSS-Protection). [PENDING]
    14.7. Implement least-privilege rules for any deployed services and rotate keys periodically. [PENDING]
    14.8. Add dependency scanning in CI to detect vulnerable packages (Dependabot or Snyk). [PENDING]
    14.9. Add a data deletion flow or “wipe my data” option for privacy-minded users. [PENDING]
    14.10. Review logs to redact PII (emails, account numbers) before shipping to external services. [PENDING]

15. Observability & Telemetry
    15.1. Add structured client-side logging and error reporting (Sentry or similar), with environment tags. [PENDING]
    15.2. Add performance monitoring: basic RUM metrics and error rates per route. [PENDING]
    15.3. Add analytics events for key user actions (add expense, partial payment, export). [PENDING]
    15.4. Track funnel conversion (install → add first expense → return in 7 days). [PENDING]
    15.5. Allow user opt-in/out for anonymous analytics; store preference in settings. [PENDING]
    15.6. Add a lightweight audit log of actions saved locally and optionally uploaded to feedback API. [PENDING]
    15.7. Dashboard to visualize error trends and slow pages across releases. [PENDING]
    15.8. Add alerting for critical issues (build failing, high client JS errors) to your team channel. [PENDING]
    15.9. Keep logs for a limited retention period and have archival policy defined. [PENDING]
    15.10. Add an internal /debug route gated by dev mode to show local diagnostics (cache size, storage usage). [PENDING]

16. UX Edge Cases & Error States
    16.1. Handle corrupted localStorage gracefully (try/catch with migration). [PENDING]
    16.2. Show meaningful UI for lack of network: “Offline — actions will queue.” [PENDING]
    16.3. Add fallback for unsupported browser features (IndexedDB failure). [PENDING]
    16.4. Provide helpful next steps for every error message (e.g., “Try saving again” + “Report” button). [PENDING]
    16.5. Avoid losing form data on navigation — autosave drafts to storage during form entry. [PENDING]
    16.6. Handle daylight saving time / timezone issues in invoices/EMI schedules. [PENDING]
    16.7. Limit extremely large numbers and add validation for absurd input values. [PENDING]
    16.8. Put caps on pagination sizes and add server-side safety for large exports. [PENDING]
    16.9. Add graceful fallback images/icons for network load failure. [PENDING]
    16.10. Add monitoring of failed requests and automatic retry backoff for transient failures. [PENDING]

17. Tiny “1%” UX improvements (micro details)
    17.1. Make the Add button sticky in mobile view for easy reach. [PENDING]
    17.2. Add copy-to-clipboard for export shareable IDs. [PENDING]
    17.3. Add small vibration or haptic feedback for mobile where supported on success. [PENDING]
    17.4. Add colorblind-friendly palette option and verify charts for colorblind-safe contrast. [PENDING]
    17.5. Add tiny animations on icons to indicate live changes (e.g., small pulse on new notifications). [PENDING]
    17.6. Use localized currency formatting and preserve user locale preference. [PENDING]
    17.7. Add subtle shadow elevation to floating buttons for better affordance. [PENDING]
    17.8. Add date picker with quick presets (Today, This Month, Custom range). [PENDING]
    17.9. Use progressive disclosure for tag filters (show top 5, expand for full list). [PENDING]
    17.10. Add keyboard shortcuts for power users (e.g., n to add new expense). [PENDING]

18. Internationalization & Localization
    18.1. Externalize all strings into a translation file and prepare for i18n (i18next or built-in layering). [PENDING]
    18.2. Add number and date formatters using Intl and allow user override. [PENDING]
    18.3. Add translated copy for at least one additional language as an initial test. [PENDING]
    18.4. Test RTL layout for languages like Arabic/Hebrew if you plan to support them. [PENDING]
    18.5. Localize currency symbols and formats per user preference. [PENDING]
    18.6. Add fallback language if translation key missing. [PENDING]
    18.7. Add locale-aware sorting for lists (collation). [PENDING]
    18.8. Add language selector in settings and persist to storage. [PENDING]
    18.9. Make sure date/time inputs use appropriate pickers for local expectations. [PENDING]
    18.10. Audit icons/graphics for cultural appropriateness. [PENDING]

19. Documentation & Help
    19.1. Add a docs/ folder with a Getting Started guide, architecture notes, and how-to articles. [PENDING]
    19.2. Add inline storybook (or component docs) for independent UI testing and developer handoff. [PENDING]
    19.3. Add a short FAQ in README answering “How data is stored?” and “How do I backup/export?”. [PENDING]
    19.4. Add API docs for server/feedback-api with example curl requests. [PENDING]
    19.5. Add a Troubleshooting section for common local dev issues (port conflicts, db setup). [PENDING]
    19.6. Add a CHANGELOG.md and follow a changelog convention (Keep a Changelog). [PENDING]
    19.7. Document the design tokens (colors, spacing, font sizes) with usage examples. [PENDING]
    19.8. Add screenshots for major flows in README to help users quickly evaluate the app. [PENDING]
    19.9. Add short videos or animated GIFs for onboarding and main flows. [PENDING]
    19.10. Add a roadmap doc to collect planned features and priorities. [PENDING]

20. Developer Experience (DX)
    20.1. Make npm run dev fast with hot module replacement; add helpful logging messages in startup. [PENDING]
    20.2. Provide make or just recipes for common tasks (dev, build, lint, test). [PENDING]
    20.3. Add Docker dev-compose for onboarding contributors with a single command. [PENDING]
    20.4. Use environment-specific configs and keep credentials out of repo. [PENDING]
    20.5. Add a local seed script to populate demo data for quicker testing. [PENDING]
    20.6. Provide per-PR checklists for reviewers (security, accessibility, perf). [PENDING]
    20.7. Provide a lightweight CONTRIBUTING guide for first-time contributors. [PENDING]
    20.8. Keep src imports relative and simplify with paths in tsconfig where helpful. [PENDING]
    20.9. Add CLI scripts to run common diagnostics (list package versions, check lint). [PENDING]
    20.10. Add repo badges for build status, coverage, npm version to README. [PENDING]

21. UX Research & Product Strategy
    21.1. Add simple in-app survey (small 2-question modal after N-days) to gather qualitative feedback. [PENDING]
    21.2. Add event logging to understand drop-off points in funnel. [PENDING]
    21.3. Add onboarding A/B test variants to experiment with different first-run flows. [PENDING]
    21.4. Build user personas and map top 10 user journeys to optimize UI flow. [PENDING]
    21.5. Add a roadmap prioritization spreadsheet (impact vs effort). [PENDING]
    21.6. Run regular usability tests with 5 users every release to validate UX assumptions. [PENDING]
    21.7. Add retention metrics and measure 1-day, 7-day, and 30-day retention. [PENDING]
    21.8. Add in-app help/chat integration if you expect larger user base. [PENDING]
    21.9. Create onboarding checklist progress indicators to reduce first-time user anxiety. [PENDING]
    21.10. Add a “changelog & updates” area inside the app to announce new features. [PENDING]

22. Marketing & Distribution
    22.1. Prepare a short landing page that explains benefits in 3 bullets and CTA to repo or deployed demo. [PENDING]
    22.2. Add social preview images (og:image) and meta tags to index.html. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
    22.3. Ensure index.html has helpful meta title and description for SEO. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
    22.4. Add demo deployment (Vercel/Netlify) with a seeded demo mode for testers. [PENDING]
    22.5. Create a short YouTube demo and GIFs for the README. [PENDING]
    22.6. Add analytics to measure traffic on the demo page and UI flows visitors use. [PENDING]
    22.7. Build an email capture to announce releases if you plan a broader rollout. [PENDING]
    22.8. Create template PRs for contributor outreach and label issues as “good first issue”. [PENDING]
    22.9. Add a list of community contributors and a small AUTHORS.md. [PENDING]
    22.10. Make screenshots for App Store / Play Store if packaging as PWA. [PENDING]

23. Accessibility for non-sighted and low-vision users (extra)
    23.1. Provide large text mode (increase base font size) toggle in settings. [PENDING]
    23.2. Add contrast mode to further improve text readability beyond default dark mode. [PENDING]
    23.3. Ensure focus outlines are visible for keyboard navigation in both themes. [PENDING]
    23.4. Provide a screen-reader-only summary of main dashboards (key stats). [PENDING]
    23.5. Create a printable view of reports for offline sharing and readability. [PENDING]
    23.6. Enable high-contrast rendering for charts (line/marker emphasis). [PENDING]
    23.7. Add a single-click text resizing control that scales the whole app. [PENDING]
    23.8. Test common screen-readers on Windows and macOS with baseline flows. [PENDING]
    23.9. Document accessibility features in README to attract accessibility-minded users. [PENDING]
    23.10. Add a11y test in CI that fails on regressions for critical pages. [PENDING]

24. Release & Versioning
    24.1. Decide on versioning scheme (semver) and maintain CHANGELOG. [PENDING]
    24.2. Tag releases and automate release notes from PR titles. [PENDING]
    24.3. Create a ‘release checklist’ to ensure performance & regressions are checked before publishing. [PENDING]
    24.4. Add a “beta” or prerelease channel for early adopters via Vercel preview deployments. [PENDING]
    24.5. Automate publishing of a bundled zip with dist for manual distribution. [PENDING]
    24.6. Periodically audit dependencies and plan major version updates in a controlled way. [PENDING]
    24.7. Keep a migration guide for breaking changes for users who self-host. [PENDING]
    24.8. Publish a minimal changelog snippet inside app on update for returning users. [PENDING]
    24.9. Automate semantic-release if you want automated changelogs and tagging. [PENDING]
    24.10. Track major regressions between releases and allow easy rollback of deployments. [PENDING]

25. UX Accessibility to Finance Concepts
    25.1. Provide a glossary for finance terms used (EMI, amortization, principal, interest). [PENDING]
    25.2. Add small inline examples when entering interest rates or tenure to clarify units. [PENDING]
    25.3. Add safe defaults for currency and decimal places to avoid confusion. [PENDING]
    25.4. Provide quick calculators for interest vs principal breakdown per payment. [PENDING]
    25.5. Add schedule visualizer to show payment schedule in simple calendar form. [PENDING]
    25.6. Allow users to mark payments as “confirmed” (manual reconciliation) with timestamp. [PENDING]
    25.7. Provide warnings for negative or zero interest edge cases. [PENDING]
    25.8. Add a “teach me” mode that explains assumptions behind projections. [PENDING]
    25.9. Provide printable amortization schedules and CSV export. [PENDING]
    25.10. Add visual cues for expenses nearing completion and those overdue. [PENDING]

26. Miscellaneous very-fine-grain improvements (micro-nits)
    26.1. Add a favicon and multiple sizes for better brand recognition in tabs (16, 32, 48). [PENDING]
    26.2. Ensure meta viewport tag is present and optimized in index.html. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
    26.3. Add concise file headers for license and copyright in top-level files. [PENDING]
    26.4. Ensure index.html includes theme-color meta tag for mobile browsers. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>
    26.5. Hard-code critical CSS into critical path for first paint if necessary. [PENDING]
    26.6. Reduce console noise in dev mode by silencing non-actionable warnings. [PENDING]
    26.7. Add server and client test credentials for local dev only and document them. [PENDING]
    26.8. Add keyboard accessible date ranges for charts and time pickers. [PENDING]
    26.9. Add local dev alias hostnames to simplify API proxy setup (e.g., api.local). [PENDING]
    26.10. Add npm run doctor to check environment problems (node version, .env presence). [PENDING]

27. Accessibility of the Development Experience (for contributors)
    27.1. Provide SECURITY.md with PGP key for reporting vulns. [PENDING]
    27.2. Make example .env files with placeholders and minimal instructions. [PENDING]
    27.3. Add an onboarding short video for contributors explaining project layout. [PENDING]
    27.4. Add a CONTRIBUTOR GUIDE for code review expectations (review checklist). [PENDING]
    27.5. Keep PR templates for feature, bugfix and chore categories. [PENDING]
    27.6. Label issues that are good first issues and keep them updated. [PENDING]
    27.7. Add a monthly maintenance checklist for dependency upgrades. [PENDING]
    27.8. Use Dependabot to auto-propose upgrades and test them in CI. [PENDING]
    27.9. Provide sample seeds for DB if server uses postgres to ease developer testing. [PENDING]
    27.10. Provide local dev scripts to run backend and frontend together reliably. [PENDING]

28. Scalability & Future-proofing
    28.1. Make data access layer replaceable (swap localStorage for remote DB) with minimal UI changes. [PENDING]
    28.2. Design components to support multi-account/multi-user flows if you pivot to cloud sync. [PENDING]
    28.3. Decouple analytics rendering code from business logic so it can be swapped or upgraded. [PENDING]
    28.4. Prepare database migration plan if server evolves beyond feedback-api. [PENDING]
    28.5. Consider tenancy model (single vs multi) and prepare privacy separation in the model. [PENDING]
    28.6. Add rate limiting and load testing for any future server endpoints. [PENDING]
    28.7. Create a component deprecation policy and migration path for large refactors. [PENDING]
    28.8. Add caching layers (service worker / cache API) designed to be invalidated on deploy. [PENDING]
    28.9. Add architectural notes in docs to explain tradeoffs and where to optimize for scale. [PENDING]
    28.10. Add monitoring and dashboards for growth indicators (active users, error rates). [PENDING]

29. Prioritized Quick Wins (Low effort — high impact)
    29.1. Add a favicon and meta tags in index.html. [PENDING]
    29.2. Purge Tailwind CSS in production build to shrink CSS size. [PENDING]
    29.3. Lazy-load Recharts only on analytics route. [PENDING]
    29.4. Add skeleton loaders for main lists to improve perceived speed. [PENDING]
    29.5. Provide an “Export JSON” button for user data. [PENDING]
    29.6. Add autosave draft of new expense entries to avoid lost input. [PENDING]
    29.7. Add form inline validation with helpful hints. [PENDING]
    29.8. Add undo toast after destructive actions for quick recovery. [PENDING]
    29.9. Add Lighthouse CI to prevent regressions. [PENDING]
    29.10. Add a simple accessibility audit (axe) and fix top 5 issues. [PENDING]
    29.11. Fix white screen issue by correcting API base URL configuration. <span style="background:#065f46;color:#fff;padding:0.1em 0.5em;border-radius:9999px;font-weight:700">COMPLETED</span>

30. Long-term roadmap items
    30.1. Add optional cloud sync & account management with encrypted server-side storage. [PENDING]
    30.2. Add multi-device sync logic and conflict resolution UI. [PENDING]
    30.3. Add bank import (CSV) or integration if you plan to expand features. [PENDING]
    30.4. Add collaborative budgets / shared expense groups for households. [PENDING]
    30.5. Add forecasting powered by ML (basic trend detection) as an opt-in advanced feature. [PENDING]
    30.6. Add Invoicing/receipts feature and attachment storage (secure, size-limited). [PENDING]
    30.7. Package as an installable PWA for mobile users with offline-first approach. [PENDING]
    30.8. Expand to multi-currency and cross-currency reporting if targeting international users. [PENDING]
    30.9. Add partner API endpoints for third-party integrations. [PENDING]
    30.10. Add paid premium features with gating and entitlement checks (if monetizing). [PENDING]

CRITICAL
�� Protection Rules Going Forward:
NEVER do these:
❌ git checkout main
❌ git push origin main
❌ git merge dev main
❌ Any operations that modify main branch
ALWAYS do these:
✅ Stay on dev branch for development
✅ Push to origin/dev only
✅ Keep main branch as stable production code
