---
title: "Getting Started"
category: Guide
date: 2026-04-15 00:00:00
tags: [Guide, Setup, React, Vite]
summary: "A quick guide to setting up and customizing your LLM Wiki Page site."
---

LLM Wiki Page is a minimalist wiki site for large language model knowledge, built with React, Vite, and Tailwind CSS. Articles are written in Markdown and loaded automatically — no database required.

## Features

- **Markdown-driven content** — articles live as `.md` files with YAML frontmatter; no database or CMS needed
- **Category & tag browsing** — sidebar navigation with category grouping and tag filtering
- **Full-text search** — instant client-side search across all article titles, summaries, and tags
- **Math rendering** — inline and block LaTeX via KaTeX (remark-math + rehype-katex)
- **Diagram support** — Mermaid.js diagrams rendered directly in articles
- **Syntax highlighting** — code blocks with language-aware highlighting via react-syntax-highlighter
- **Light / Dark theme** — toggle with persistent preference stored in localStorage
- **i18n** — UI localized in zh-CN, zh-TW, en, ja, ko via i18next
- **Animated transitions** — page and list animations powered by Framer Motion
- **About page** — driven by `src/source/about.md`, fully editable in Markdown
- **Responsive layout** — sidebar collapses on mobile, readable on any screen size

## Stack

- React 19 + Vite 6
- Tailwind CSS 4 + @tailwindcss/typography
- react-markdown, remark-gfm, remark-math, rehype-katex
- Mermaid.js for diagrams
- react-syntax-highlighter for code blocks
- i18next (zh-CN, zh-TW, en, ja, ko)
- Framer Motion

## Installation

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # output to dist/
```

## Adding Articles

Place a `.md` file in `src/public/` with frontmatter:

```markdown
---
title: "Article Title"
category: Guide
date: 2026-04-15 00:00:00
tags: [LLM, AI]
summary: "Short description shown in the list."
---

Content here...
```

The About page is driven by `src/source/about.md`.

## Configuration

Edit `src/config.json` to update the site title, profile name, bio, social links, and theme defaults.

```json
{
  "profile": { "name": "LLM Wiki", "bio": "..." },
  "site": { "title": "LLM Wiki", "subtitle": "..." },
  "social": { "github": "...", "website": "..." },
  "ui": { "postsPerPage": 10, "defaultTheme": "light" }
}
```
