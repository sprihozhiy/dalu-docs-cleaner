# Functional Spec — Dalu Dev Agency Website

## Product Goal
Build a fast, dark-themed multi-page agency website for Dalu Dev with a live portfolio, file-based markdown blog, a working contact form delivered via Resend, and a persistent Jeeves AI chat widget connected to the OpenClaw gateway.

---

## Pages & User Flows

### 1. Home (`/`)
**Flow:**
1. Visitor lands on the page and sees a hero section with the agency name, a one-line value proposition, and a primary CTA button to `/contact`.
2. Visitor scrolls to a services overview — 3–5 short punchy cards summarising what Dalu Dev offers.
3. Visitor scrolls to a featured projects section — 3–4 portfolio cards each showing name, one-line description, tech tags, and a link.
4. Visitor clicks a featured project card → navigates to `/portfolio` (or external live link).
5. Visitor clicks any CTA → navigates to `/contact`.

**Acceptance Criteria:**
- AC-HOME-1: Page renders with an `<h1>` containing the agency name and value proposition.
- AC-HOME-2: Services section renders at least 3 service cards, each with a title and short description.
- AC-HOME-3: Featured projects section renders 3–4 project cards from the portfolio data source.
- AC-HOME-4: Primary CTA links to `/contact`.
- AC-HOME-5: Page scores ≥90 on Lighthouse Performance on desktop (Vercel deploy).

---

### 2. Services (`/services`)
**Flow:**
1. Visitor reads a detailed breakdown of services offered (AI development, web apps, automation, etc.).
2. Visitor reads the agency process: Consult → Spec → Design → Build → Deploy.
3. Visitor sees optional pricing tiers or "starting at" text.
4. Visitor clicks CTA → navigates to `/contact`.

**Acceptance Criteria:**
- AC-SVC-1: Page renders with at least 4 distinct service items each with a title and description.
- AC-SVC-2: Process section lists all 5 stages (Consult, Spec, Design, Build, Deploy) in order.
- AC-SVC-3: A CTA button or link to `/contact` is present on the page.

---

### 3. Portfolio (`/portfolio`)
**Flow:**
1. Visitor views a grid of all projects.
2. Each card shows: project name, short description, tech stack tags, status badge (Live / In Development), and buttons for live link and repo link.
3. Visitor clicks "Live" → opens external URL in a new tab.
4. Visitor clicks "Repo" → opens GitHub URL in a new tab.

**Acceptance Criteria:**
- AC-PORT-1: All portfolio projects from the data source are rendered.
- AC-PORT-2: Each card displays name, description, tech tags, and status badge.
- AC-PORT-3: "Live" links open in `target="_blank"` with `rel="noopener noreferrer"`.
- AC-PORT-4: "Repo" links open in `target="_blank"` with `rel="noopener noreferrer"`.
- AC-PORT-5: Projects with status "in-development" show a distinct visual badge vs "live".

---

### 4. Blog (`/blog` and `/blog/[slug]`)
**Flow — Listing:**
1. Visitor sees a list of published blog posts sorted by date descending.
2. Each entry shows: title, date, category badge, and excerpt.
3. Visitor clicks a post → navigates to `/blog/[slug]`.

**Flow — Post:**
1. Visitor reads the full post rendered from Markdown.
2. Post shows: title, date, category, and full body content.
3. Visitor can navigate back to `/blog`.

**Acceptance Criteria:**
- AC-BLOG-1: `/blog` lists all `.md` files found in `content/blog/` sorted by `date` frontmatter descending.
- AC-BLOG-2: Each post card shows title, date (formatted `MMM D, YYYY`), category, and excerpt.
- AC-BLOG-3: `/blog/[slug]` renders Markdown body as HTML.
- AC-BLOG-4: A missing slug returns a 404 page (Next.js `notFound()`).
- AC-BLOG-5: Frontmatter fields `title`, `date`, `category`, `excerpt` are required; posts missing them are excluded from listing.
- AC-BLOG-6: Category values are one of: `tech`, `ai`, `project-updates`, `agency-life`.

---

### 5. Contact (`/contact`)
**Flow:**
1. Visitor fills out the form: Name, Email, Message (all required).
2. Visitor submits the form.
3. On success: a confirmation message appears ("Thanks — we'll be in touch."). Form fields are cleared.
4. On API error: an inline error message appears ("Something went wrong. Please try again.").
5. While submitting: button shows a loading state and is disabled.
6. Email is delivered to `sprihozhiy@gmail.com`.

**Acceptance Criteria:**
- AC-CONTACT-1: Form has three fields: `name` (text), `email` (email), `message` (textarea) — all required.
- AC-CONTACT-2: Client-side validation prevents submit if any field is empty or email is malformed.
- AC-CONTACT-3: On valid submit, `POST /api/contact` is called with `{ name, email, message }`.
- AC-CONTACT-4: On 200 response, success message is shown and form is reset.
- AC-CONTACT-5: On non-200 response, error message is shown; form is not reset.
- AC-CONTACT-6: Submit button is disabled and shows "Sending…" while the request is in flight.
- AC-CONTACT-7: Resend delivers an email to `sprihozhiy@gmail.com` with sender name, email, and message in the body.
- AC-CONTACT-8: Submissions with empty or whitespace-only fields are rejected by the API with 400.
- AC-CONTACT-9: Submissions with an invalid `email` format are rejected by the API with 400.

---

### 6. Jeeves Chat Widget
**Flow:**
1. Widget is visible as a floating button on every page (bottom-right corner).
2. Visitor clicks the button → chat panel opens.
3. Visitor types a message and presses Enter or clicks Send.
4. While waiting for a response, a loading indicator is shown.
5. Jeeves responds — response is appended to the conversation.
6. Visitor can continue the conversation (full message history is maintained in session).
7. Visitor clicks close → panel collapses; history is preserved until page reload.

**Acceptance Criteria:**
- AC-CHAT-1: Chat button is rendered on all pages via the root layout (`app/layout.js`).
- AC-CHAT-2: Clicking the button toggles the chat panel open/closed.
- AC-CHAT-3: Closing and reopening the panel preserves the conversation history within the same page session.
- AC-CHAT-4: Sending a message calls `POST /api/chat` with the full message history.
- AC-CHAT-5: The input field is disabled while a response is in flight.
- AC-CHAT-6: On API error, an inline error message is shown; the user's message remains in the input.
- AC-CHAT-7: Jeeves has a system prompt that instructs it to act as a helpful, witty, professional assistant for Dalu Dev — knowledgeable about services, portfolio, pricing, and process.
- AC-CHAT-8: The first message in every conversation includes the system prompt.
- AC-CHAT-9: Widget is accessible via keyboard (focusable toggle button, Enter to send).

---

## Global / Layout Requirements
- **AC-LAYOUT-1:** A navigation bar is present on all pages with links to: Home, Services, Portfolio, Blog, Contact.
- **AC-LAYOUT-2:** The active page is visually distinguished in the nav.
- **AC-LAYOUT-3:** A footer is present on all pages with copyright and optional social links.
- **AC-LAYOUT-4:** The site is mobile-first and fully responsive (breakpoints: sm 640px, md 768px, lg 1024px).
- **AC-LAYOUT-5:** Dark theme is applied globally via Tailwind CSS v4 CSS variables.
- **AC-LAYOUT-6:** No lorem ipsum placeholder text anywhere in the delivered build.

---

## Out of Scope
- User authentication or accounts of any kind.
- CMS or database — blog is file-based only.
- Payment processing.
- Real-time features (WebSockets, SSE streaming from chat).
- Admin panel for managing blog posts or portfolio.
- i18n / multi-language support.
- Dark/light mode toggle (dark only).
- Calendly or scheduling integration (noted as "optional" in brief — deferred).
- Analytics beyond what Vercel provides by default.
- Automated blog post generation.

---

## Open Questions
1. **OpenClaw on Vercel:** `OPENCLAW_GATEWAY_URL` is `http://localhost:18789` which will not be reachable from Vercel serverless functions. Does Serhii have a tunnel (ngrok/cloudflare tunnel) or a public URL for the gateway? The env var should be configurable at deploy time.
2. **Portfolio content:** Exact list of projects (Rotiva, AeroSentra, Jeeves Voice, etc.) — needs real descriptions, live URLs, and repo URLs from Serhii before development.
3. **Services pricing:** Should the services page include specific prices/ranges, or "contact for quote" only?
4. **Contact form sender address:** Resend requires a verified sender domain. What `from` address should be used? (e.g. `hello@daludev.com`)
5. **Blog seed posts:** Will Serhii provide at least one real post before launch, or should the spec include a placeholder post in the repo?
6. **Jeeves system prompt:** Full text of the system prompt (agency knowledge base) needs to be authored — a draft is included in `integration-spec.md` but must be reviewed.
