# Design Brief: Dalu Docs Cleaner Dashboard

## 1. Overview

This document outlines the design concept for the Dalu Docs Cleaner dashboard. The goal is to create a high-end, dark-themed interface that is both visually striking and highly functional. The theme is inspired by classic terminal interfaces, blending a retro-tech aesthetic with modern design principles.

## 2. Core Theme & Aesthetic

*   **Primary Theme:** Terminal Noir
*   **Background:** Deep Obsidian (#0D0D11) - A very dark, almost black color that provides a sense of depth and focus.
*   **Accent Color:** Neon Cyan (#00FFFF) - Used for all primary text, icons, and interactive elements. This creates a high-contrast, "glow" effect reminiscent of vintage terminal screens.
*   **Secondary Colors:**
    *   **Subtle Gray:** (#888888) For less important text or disabled elements.
    *   **Highlight/Accent:** A touch of Magenta/Pink for specific highlights or alerts to break the monochrome cyan.

## 3. Typography

*   **Font:** A monospaced font will be used throughout the dashboard to reinforce the terminal aesthetic. `Fira Code`, `Source Code Pro`, or a similar font with good readability will be chosen.
*   **Hierarchy:**
    *   **H1/H2:** Large, bold neon-cyan for major headings.
    *   **Body Text:** Standard weight neon-cyan.
    *   **Labels/Subtext:** Lighter weight or the subtle gray color.

## 4. Layout & Components

*   **Structure:** The layout will be based on a clean, grid-based system. Spacing will be generous to avoid a cluttered feel.
*   **Dashboard Panels:** Content will be organized into "windows" or panels with thin, neon-cyan borders, simulating multiple terminal sessions. These panels will have a slightly lighter background than the main obsidian base to create a sense of depth.
*   **Header/Navigation:** A persistent header will contain the main application title, "Dalu Docs Cleaner," and primary navigation links. The prompt "AI-Ready Documentation Scraper" will be prominently displayed, perhaps as a sub-header or tagline.
*   **Interactive Elements:**
    *   **Buttons:** Simple, rectangular buttons with a neon-cyan outline. On hover, the background will fill with the cyan color, and the text will turn to the obsidian background color.
    *   **Input Fields:** Standard input fields with a neon-cyan border and a blinking cursor effect to mimic a terminal prompt.
    *   **Icons:** Minimalist, line-art icons in neon-cyan. Icons for "File," "Globe," and "Window" will be used to represent different aspects of the scraping process.

## 5. Visual Flourishes

*   **Glow Effect:** A subtle `text-shadow` or `box-shadow` with the neon-cyan color will be applied to text and borders to create a "glow" or "bloom" effect.
*   **Scanlines (Optional):** A very subtle, almost imperceptible overlay of horizontal lines could be added to the background to enhance the CRT monitor feel.
*   **Animations:** UI interactions (hovers, clicks) will have fast, crisp animations. For example, buttons might have a quick "flicker" effect on click.

## 6. Prompt

The central theme of the application is an "AI-Ready Documentation Scraper." The design will reflect this by:

*   Having a large, central area for inputting the target documentation URL.
*   Displaying the status of the scraping process (e.g., "Fetching...", "Parsing...", "Cleaning...", "Complete").
*   Presenting the cleaned, AI-ready output in a clear, code-like format.
