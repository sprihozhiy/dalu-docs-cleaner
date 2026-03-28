# Integration Spec — Dalu Dev Agency Website

## Stack Reference
| Field | Value |
|---|---|
| Language | JavaScript ES2022 |
| Runtime | Node 20 |
| Frontend | Next.js 15 — App Router |
| Backend | Next.js API Routes (Route Handlers) |
| CSS | Tailwind CSS v4 |
| Email | Resend (`resend` npm package) |
| Blog | Markdown files via `gray-matter` + `remark` + `remark-html` |
| Chat | OpenClaw gateway (OpenAI-compatible `/v1/chat/completions`) |
| Test runner | Vitest |
| Deploy | Vercel |

---

## Environment Variables

| Variable | Source | Required | Description |
|---|---|---|---|
| `RESEND_API_KEY` | Vercel env / `.env.local` | Yes | Resend secret key for email delivery |
| `OPENCLAW_GATEWAY_TOKEN` | Vercel env / `.env.local` | Yes | Bearer token for OpenClaw gateway |
| `OPENCLAW_GATEWAY_URL` | Vercel env / `.env.local` | Yes | Base URL for OpenClaw gateway (default: `http://localhost:18789/v1/chat/completions`) |
| `CONTACT_EMAIL` | Hardcoded in route | — | `sprihozhiy@gmail.com` |
| `CONTACT_FROM_ADDRESS` | Vercel env / `.env.local` | Yes | Verified Resend sender address (e.g. `hello@daludev.com`) |

> **Note:** `OPENCLAW_GATEWAY_URL` must be set to a publicly reachable URL on Vercel. The localhost default only works in local development. See Open Question #1 in functional-spec.md.

---

## File Structure (App Router)

```
app/
  layout.js              — Root layout: nav, footer, chat widget
  page.js                — Home /
  services/
    page.js              — /services
  portfolio/
    page.js              — /portfolio
  blog/
    page.js              — /blog (listing)
    [slug]/
      page.js            — /blog/[slug] (post)
  contact/
    page.js              — /contact (form UI)
  api/
    contact/
      route.js           — POST /api/contact
    chat/
      route.js           — POST /api/chat

components/
  layout/
    Navbar.js
    Footer.js
  chat/
    ChatWidget.js        — floating button + panel
    ChatPanel.js         — message list + input
  portfolio/
    ProjectCard.js
  blog/
    PostCard.js
  contact/
    ContactForm.js

lib/
  blog.js                — Markdown reading utilities
  portfolio.js           — Portfolio data (static JS export)

content/
  blog/                  — .md files (frontmatter + body)

data/
  portfolio.js           — Static portfolio project list
```

---

## Data Models

### BlogPost
```js
// Returned by lib/blog.js — getAllPosts() and getPostBySlug()
{
  slug: string,          // filename without .md, e.g. "hello-world"
  title: string,         // frontmatter: title
  date: string,          // frontmatter: date — ISO 8601, e.g. "2026-03-28"
  category: 'tech' | 'ai' | 'project-updates' | 'agency-life',
  excerpt: string,       // frontmatter: excerpt
  tags: string[],        // frontmatter: tags (optional, default [])
  content: string,       // HTML string — only present in getPostBySlug()
}
```

### PortfolioProject
```js
// Exported from data/portfolio.js
{
  id: string,            // slug-style id, e.g. "rotiva"
  name: string,          // display name
  description: string,   // 1–2 sentence description
  stack: string[],       // tech tag array, e.g. ["Next.js", "Python", "Whisper"]
  liveUrl: string | null,
  repoUrl: string | null,
  status: 'live' | 'in-development',
}
```

### ContactFormPayload (client → API)
```js
{
  name: string,          // non-empty, max 100 chars
  email: string,         // valid email format
  message: string,       // non-empty, max 2000 chars
}
```

### ChatRequest (client → API)
```js
{
  messages: ChatMessage[],   // full conversation history (excluding system prompt)
}
```

### ChatMessage
```js
{
  role: 'user' | 'assistant',
  content: string,
}
```

### ChatResponse (API → client)
```js
{
  message: string,   // assistant reply text
}
```

---

## API Routes

### POST /api/contact — NEW
**File:** `app/api/contact/route.js`

**Purpose:** Validates the contact form submission and sends an email via Resend.

**Request:**
```
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "I'd like to discuss a project."
}
```

**Validation (server-side):**
- `name`: required, non-empty after `.trim()`, max 100 chars
- `email`: required, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `message`: required, non-empty after `.trim()`, max 2000 chars

**Success Response `200`:**
```json
{ "ok": true }
```

**Error Responses:**
| Status | Body | Condition |
|---|---|---|
| 400 | `{ "error": "Name is required" }` | `name` missing or blank |
| 400 | `{ "error": "Valid email is required" }` | `email` missing or invalid |
| 400 | `{ "error": "Message is required" }` | `message` missing or blank |
| 400 | `{ "error": "Message is too long" }` | `message` > 2000 chars |
| 405 | `{ "error": "Method not allowed" }` | Non-POST request |
| 500 | `{ "error": "Failed to send email" }` | Resend API error |

**Resend API call (inside route handler):**
```js
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: process.env.CONTACT_FROM_ADDRESS,  // e.g. "Dalu Dev <hello@daludev.com>"
  to: ['sprihozhiy@gmail.com'],
  subject: `New contact from ${name}`,
  html: `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `,
  replyTo: email,
})
```

> HTML must escape `name`, `email`, `message` to prevent XSS in email body.

---

### POST /api/chat — NEW
**File:** `app/api/chat/route.js`

**Purpose:** Receives the conversation history and proxies it to the OpenClaw gateway (OpenAI-compatible endpoint), prepending the Jeeves system prompt.

**Request:**
```
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "What services do you offer?" }
  ]
}
```

**Validation:**
- `messages`: required, non-empty array
- Each element: `{ role: 'user'|'assistant', content: string }`

**OpenClaw Gateway call:**
```
POST ${OPENCLAW_GATEWAY_URL}
Authorization: Bearer ${OPENCLAW_GATEWAY_TOKEN}
Content-Type: application/json

{
  "model": "jeeves",
  "messages": [
    {
      "role": "system",
      "content": "<JEEVES_SYSTEM_PROMPT>"
    },
    ...messages   // from request body
  ],
  "stream": false
}
```

**JEEVES_SYSTEM_PROMPT (draft — must be reviewed by Serhii):**
```
You are Jeeves, the AI assistant for Dalu Dev — an AI development agency run by Serhii.

About Dalu Dev:
- We build AI-powered web applications, automation tools, and intelligent agents.
- Services: AI integration, full-stack web development, process automation, LLM fine-tuning advisory.
- Process: Consult → Spec → Design → Build → Deploy.
- Pricing: starting at $500 for small projects; contact for custom quotes.
- Portfolio: Rotiva, AeroSentra, Jeeves Voice (ask for details on any project).
- Contact: use the contact form at /contact or email sprihozhiy@gmail.com.

Personality: helpful, witty, and professional. You know the agency inside and out.
Keep answers concise. When unsure, direct the visitor to the contact form.
```

**Success Response `200`:**
```json
{ "message": "Jeeves reply text here" }
```

**Extracting the reply from OpenClaw response:**
```js
// OpenClaw uses OpenAI-compatible response format
const data = await gatewayResponse.json()
const message = data.choices[0].message.content
```

**Error Responses:**
| Status | Body | Condition |
|---|---|---|
| 400 | `{ "error": "messages array is required" }` | Missing or empty `messages` |
| 405 | `{ "error": "Method not allowed" }` | Non-POST request |
| 502 | `{ "error": "Chat service unavailable" }` | Gateway unreachable or 5xx |
| 500 | `{ "error": "Unexpected error" }` | Any other unhandled error |

---

## Blog Utilities (`lib/blog.js`)

### `getAllPosts()`
```js
// Returns BlogPost[] sorted by date descending, WITHOUT content field
// Reads all .md files from content/blog/
// Excludes posts missing required frontmatter (title, date, category, excerpt)
getAllPosts() → BlogPost[]
```

**Implementation notes:**
- Uses `fs.readdirSync('content/blog/')` to list files
- Parses each file with `gray-matter`
- Converts `date` string to sortable value for ordering
- Never throws — malformed files are silently skipped

### `getPostBySlug(slug)`
```js
// Returns full BlogPost including content (HTML string from remark)
// Returns null if slug not found
getPostBySlug(slug: string) → BlogPost | null
```

**Implementation notes:**
- Reads `content/blog/${slug}.md`
- Parses frontmatter with `gray-matter`
- Converts Markdown body to HTML with `remark` + `remark-html`
- Returns `null` for missing files (triggers `notFound()` in page)

---

## Portfolio Data (`data/portfolio.js`)

Static JS module. Example shape:
```js
export const projects = [
  {
    id: 'rotiva',
    name: 'Rotiva',
    description: 'AI-powered video rotation and processing tool.',
    stack: ['Next.js', 'Python', 'FFmpeg'],
    liveUrl: 'https://rotiva.app',
    repoUrl: null,
    status: 'live',
  },
  // ...
]
```

`data/portfolio.js` is maintained by hand. No API or database.

---

## Component → Endpoint Mapping

| Component | Calls | Method |
|---|---|---|
| `ContactForm.js` | `/api/contact` | POST |
| `ChatWidget.js` / `ChatPanel.js` | `/api/chat` | POST |
| `app/blog/page.js` | `lib/blog.getAllPosts()` | (direct, server component) |
| `app/blog/[slug]/page.js` | `lib/blog.getPostBySlug(slug)` | (direct, server component) |
| `app/portfolio/page.js` | `data/portfolio.projects` | (direct, static import) |
| `app/page.js` (Home) | `data/portfolio.projects` (slice 0–3) + `lib/blog.getAllPosts()` (slice 0–2) | (direct, server component) |

---

## Next.js Static Generation Notes

- `/blog` and `/blog/[slug]` are statically generated at build time (`generateStaticParams`).
- `generateStaticParams` in `app/blog/[slug]/page.js` calls `getAllPosts()` and returns `[{ slug }]` for each post.
- Portfolio and services pages are fully static — no data fetching at request time.
- Contact and Chat widget are client components (`'use client'`) for form state.

---

## Security Notes
- All user input rendered in HTML email must be escaped to prevent stored XSS.
- `RESEND_API_KEY` and `OPENCLAW_GATEWAY_TOKEN` are server-only — never referenced in client components.
- Chat route does not expose the gateway URL or token to the client.
- External links on portfolio page use `rel="noopener noreferrer"`.
