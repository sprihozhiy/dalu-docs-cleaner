# Dalu Dev Agency — Website Rebuild

## What we're building
A multi-page website for **Dalu Dev**, a freelance AI development agency run by Serhii. The current site is a placeholder — this is a full rebuild with real content, real forms, and a live AI chat widget.

## Pages

### 1. Home / Landing
- Hero section: clear value proposition (AI-powered development agency)
- Services overview (short, punchy)
- Featured projects (3-4 best ones)
- Call to action → contact

### 2. Services
- Detailed breakdown of what we offer
- Approach / process (consult → spec → design → build → deploy)
- Pricing tiers or "starting at" ranges (optional)

### 3. Portfolio
- Live project links (Rotiva, AeroSentra, Jeeves Voice, etc.)
- Each entry: name, description, tech stack, live link, repo link
- Status indicators (live / in development)

### 4. Blog
- Jeeves can generate posts on request
- Markdown-based, stored in the repo
- Clean reading experience
- Categories: tech, AI, project updates, agency life

### 5. Contact
- Real contact form (not fake — actually sends email)
- **Resend** for email delivery
- Submissions go to: sprihozhiy@gmail.com
- Success redirect / confirmation message
- Optional: Calendly or scheduling link

### 6. AI Chat Widget (Jeeves)
- Persistent on all pages
- Visitors talk to Jeeves about the agency
- Jeeves knows: services, pricing, portfolio, team, process
- Connected to OpenClaw gateway for real responses
- Personality: helpful, witty, professional — same as Jeeves

## Tech Stack
- Next.js 15 + App Router
- Tailwind CSS v4
- Resend for email
- OpenClaw gateway for chat widget
- Deploy: Vercel (this is a public site, not local-only)
- Markdown for blog posts (file-based, not a CMS)

## Design Direction
- Dark theme (consistent with Jeeves brand)
- Professional but not corporate
- Mobile-first
- Subtle animations (not distracting)
- Clean typography

## What this is NOT
- Not a single-page landing
- Not a template with placeholder content
- Not a portfolio that looks like every other dev agency
- Not bloated — fast, minimal, intentional

## Constraints
- Real content only — no lorem ipsum
- Real email — Resend integration must work
- Blog posts are real — not auto-generated slop
- Chat widget must be functional on all pages
