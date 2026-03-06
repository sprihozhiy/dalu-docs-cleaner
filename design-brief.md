# Dalu Docs Cleaner: Design Brief

## Vision
**AI-Ready Documentation Scraper.** A high-performance, terminal-centric dashboard designed for developers who need to transform messy web documentation into clean, LLM-ready markdown or JSON.

## Core Aesthetic: "Obsidian Terminal"
- **Background:** Obsidian (#050505) - Deeper than standard black, providing a vacuum-like depth.
- **Primary Accent:** Neon Cyan (#00f3ff) - Used for primary actions, active states, and "data flow" indicators.
- **Secondary Accent:** Matrix Green (#00ff41) - Used for success states and log output.
- **Typography:** 
  - Monospace (JetBrains Mono, Fira Code, or System Monospace).
  - High contrast for readability, low-glow effects for that "CRT" feel.
- **Borders:** Ultra-thin (1px) dimmed cyan or semi-transparent whites to maintain a skeletal, lightweight look.

## Functional Components
1. **The Command Center (Header):**
   - Breadcrumbs showing the current "Scrape Profile."
   - Connection status (System Health).
2. **The Grid (Main Interface):**
   - **Left Panel (Inputs):** URL entry, depth configuration, and "AI Context" filters.
   - **Center Panel (Live Scrape):** A real-time terminal feed showing DOM traversal and cleaning progress.
   - **Right Panel (Preview):** A markdown preview of the "Cleaned" output.
3. **The Utility Belt (Sidebar):**
   - History of scrapes.
   - AI Model presets (GPT-4o, Claude 3.5, etc.).
   - Export settings.

## Design Principles
- **Minimalist Friction:** Actions should feel like typing a command.
- **Information Density:** High, but organized via strict geometry.
- **Feedback Loops:** Every scrape step must be visualized via the terminal log to ensure the user feels in control of the AI-readying process.
