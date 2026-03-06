# Design Brief: Dalu Docs Cleaner Dashboard

## 1. Project Overview
**Product:** Dalu Docs Cleaner  
**Tagline:** "AI-Ready Documentation Scraper"  
**Goal:** Create a high-end, terminal-inspired dashboard for developers and AI engineers to scrape, clean, and structure documentation for LLM ingestion.

## 2. Visual Identity & Theme
- **Theme:** "Obsidian Terminal"
- **Background:** Obsidian Black (`#050505`) - Deep, matte black with subtle depth.
- **Primary Accent:** Neon Cyan (`#00FFFF`) - Used for text, glowing borders, and interactive elements. Represents "Digital Energy" and "AI Readiness."
- **Secondary Accent:** Matrix Green (`#00FF41`) - Used for "Success" states and terminal output logs.
- **Error State:** Pulse Red (`#FF3131`) - Used for failed scrapes or invalid URLs.
- **Typography:**
  - **Headings/UI:** *JetBrains Mono* or *Fira Code* (Monospace) - reinforces the developer-centric, terminal aesthetic.
  - **Body (Optional):** *Inter* (Sans-serif) for high legibility in long Markdown previews, though Mono is preferred for the "vibe."

## 3. Key Design Elements
- **Scan Lines & Glow:** Subtle horizontal scan lines and soft outer glows on containers to evoke a retro-futuristic CRT/Terminal feel.
- **Modular Grid:** A strict, grid-based layout that feels organized and "engineered."
- **Command-Line Integration:** A persistent "Command Bar" at the bottom for keyboard-driven navigation (`Ctrl+K` style).
- **Glassmorphism:** Subtle use of semi-transparent layers for modals and overlays to maintain depth against the obsidian background.

## 4. User Experience (UX) Flow
1. **The Entry (Initiation):** A central, glowing input field for the documentation URL.
2. **The Scan (Discovery):** A real-time "Knowledge Graph" visualization showing the site's structure as the crawler maps it.
3. **The Clean (Refinement):** A split-view interface:
   - *Left:* Live site preview with "Click-to-Remove" functionality for headers, footers, and ads.
   - *Right:* Real-time Markdown output showing the "Cleaned" version.
4. **The Export (Delivery):** One-click options for Markdown, JSONL, or direct sync to RAG vector databases (Pinecone, Weaviate, etc.).

## 5. Layout Modules
- **Header:** System status (API Online, Credits remaining), Profile, and "New Project" button.
- **Sidebar:** Recent scrapes, saved "Cleaning Profiles" (e.g., "Standard GitBook Clean"), and Settings.
- **Main Stage:** The active workspace (Crawler, Cleaner, or Preview).
- **Footer:** A scrolling "Live Log" of scraping activity (Terminal style).
